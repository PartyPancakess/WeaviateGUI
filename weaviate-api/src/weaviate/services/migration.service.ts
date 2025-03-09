import { Injectable } from '@nestjs/common';
import { BaseWeaviateService } from './base.service';
import { Subject, Observable } from 'rxjs';
import { CloneCollectionDto } from '../dto/clone-collection.dto';
import { CollectionService } from './collection.service';
import { WeaviateService } from '../weaviate.service';
import { CloneTenantDto } from '../dto/clone-tenant.dto';
import { CopyCollectionDto } from '../dto/copy-collection.dto';
import { CopyTenantDto } from '../dto/copy-tenant.dto';
import { BackupDto } from '../dto/backup.dto';
import { v4 as uuidv4 } from 'uuid';
import { RestoreDto } from '../dto/restore.dto';

export interface StatusMessage {
  data: string;
  event?: string;
}

export enum MigrationType {
  cloneCollection = 'cloneCollection',
  cloneTenant = 'cloneTenant',
  copyCollection = 'copyCollection',
  copyTenant = 'copyTenant',
  backup = 'backup',
  restore = 'restore',
}

@Injectable()
export class MigrationService extends BaseWeaviateService {
  constructor(
    protected readonly weaviateService: WeaviateService,
    private readonly collectionService: CollectionService,
  ) {
    super(weaviateService);
  }
  // A map to store each process's Subject by a unique process ID.
  private processes: Map<string, Subject<StatusMessage>> = new Map();

  // Returns an Observable for status messages of the process with the given processId.
  // The SSE controller will subscribe to this Observable.
  getProcessStatus(processId: string): Observable<StatusMessage> {
    const subject = this.processes.get(processId);
    if (!subject) {
      throw new Error(`Process with id ${processId} not found`);
    }
    return subject.asObservable();
  }

  // Starts a long-running process.
  // Returns a processId immediately, and then the process emits status updates asynchronously.
  startProcess(migrationType: MigrationType, data: any): string {
    // Generate a unique process ID.
    const processId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // Create a new Subject to emit status updates.
    const subject = new Subject<StatusMessage>();
    // Store the subject so the SSE endpoint can later subscribe to it.
    this.processes.set(processId, subject);

    // Start the process asynchronously so the HTTP request doesn't block.
    setTimeout(
      () => this.runProcess(processId, subject, migrationType, data),
      1000,
    );

    return processId;
  }

  // The asynchronous process that emits status updates.
  // This example simulates work by incrementing progress every 500ms.
  async runProcess(
    processId: string,
    subject: Subject<StatusMessage>,
    migrationType: MigrationType,
    data: any,
  ) {
    try {
      switch (migrationType) {
        case MigrationType.cloneCollection:
          await this.cloneCollection(data, subject);
          break;
        case MigrationType.cloneTenant:
          await this.cloneTenant(data, subject);
          break;
        case MigrationType.copyCollection:
          await this.copyCollection(data, subject);
          break;
        case MigrationType.copyTenant:
          await this.copyTenant(data, subject);
          break;
        case MigrationType.backup:
          await this.backup(data, subject);
          break;
        case MigrationType.restore:
          await this.restore(data, subject);
          break;
        default:
          break;
      }
      // Emit the final update with a custom event name (e.g., 'final').
      subject.next({ data: 'Process completed', event: 'final' });
    } catch (err) {
      subject.error({ data: `An error occurred: ${err}`, event: 'error' });
    } finally {
      // When done, complete the subject and remove it from the map.
      subject.complete();
      this.processes.delete(processId);
    }
  }

  async cloneCollection(
    data: CloneCollectionDto,
    subject: Subject<StatusMessage>,
  ) {
    const srcColl = this.client.collections.get(data.collectionName);
    const srcConfig = await this.collectionService.getCollectionJSON(
      data.collectionName,
    );
    let targetConfig = srcConfig;
    targetConfig.class = data.cloneName;

    const startTime = Date.now();
    subject.next({
      data: `Cloning ${data.collectionName} to ${data.cloneName}\n`,
    });

    try {
      const { vectorIndexConfig, shardingConfig, ...restConfig } = targetConfig; // Remove vectorIndexConfig and shardingConfig, because it gives an error, i don't know
      await this.collectionService.createCollection(restConfig);
      await this.collectionService.updateCollection(
        data.cloneName,
        targetConfig,
      ); // Update with the removed config, it works when updating, but not creating

      subject.next({ data: `Created collection: ${data.cloneName}` });
    } catch (error) {
      subject.next({
        data: `Failed\n`,
      });
      return `Failed to clone ${data.collectionName} to ${data.cloneName}`;
    }

    const targetColl = this.client.collections.get(data.cloneName);
    targetConfig = await targetColl.config.get();

    if (targetConfig.multiTenancy.enabled) {
      // If multiTenancy is enabled, clone the tenants
      subject.next({ data: `Going tenant by tenant` });
      const tenants = await srcColl.tenants.get();

      // Go through each tenant
      for (const tenant of Object.values(tenants)) {
        // Create tenant in the target collection
        await targetColl.tenants.create({ name: tenant.name });
        subject.next({ data: `Created tenant: ${tenant.name}` });

        // Activate Tenants
        await srcColl.tenants.update({
          name: tenant.name,
          activityStatus: 'HOT',
        });
        await targetColl.tenants.update({
          name: tenant.name,
          activityStatus: 'HOT',
        });

        // Migrate objects from source tenant to target tenant
        const srcTenant = srcColl.withTenant(tenant.name);
        const targetTenant = targetColl.withTenant(tenant.name);

        const objects = (await srcTenant.query.fetchObjects())?.objects;

        if (objects && objects.length > 0) {
          await targetTenant.data.insertMany(objects);
        }

        subject.next({ data: `Copied tenant contents: ${tenant.name}` });

        if (data.disableTenants) {
          // Disable the tenants
          await srcColl.tenants.update({
            name: tenant.name,
            activityStatus: 'COLD',
          });
          await targetColl.tenants.update({
            name: tenant.name,
            activityStatus: 'COLD',
          });
        }
      }
    } else {
      // If multiTenancy is not enabled, clone the objects
      const objects = (await srcColl.query.fetchObjects())?.objects;
      if (objects && objects.length > 0) {
        await targetColl.data.insertMany(objects);
      }
    }

    subject.next({
      data: `Cloned ${data.collectionName} to ${data.cloneName}, in around ${(Date.now() - startTime) / 1000} seconds.\n`,
    });
    return `Cloned ${data.collectionName} to ${data.cloneName}`;
  }

  async cloneTenant(data: CloneTenantDto, subject: Subject<StatusMessage>) {
    const srcColl = this.client.collections.get(data.sourceCollection);
    const targetColl = this.client.collections.get(data.targetCollection);

    const srcConfig = await this.collectionService.getCollectionJSON(
      data.sourceCollection,
    );

    if (!srcConfig.multiTenancyConfig.enabled) {
      subject.next({
        data: `Multi-tenancy not enabled.\n`,
      });
      return 'Multi-tenancy not enabled.';
    }

    const startTime = Date.now();
    subject.next({
      data: `Cloning ${data.sourceTenant} (from ${data.sourceCollection}) to ${data.targetTenant} (from ${data.targetCollection})\n`,
    });

    await targetColl.tenants.create({ name: data.targetTenant });
    subject.next({ data: `Created tenant: ${data.targetTenant}` });

    // Activate Tenants
    await srcColl.tenants.update({
      name: data.sourceTenant,
      activityStatus: 'HOT',
    });
    await targetColl.tenants.update({
      name: data.targetTenant,
      activityStatus: 'HOT',
    });

    const srcTenant = srcColl.withTenant(data.sourceTenant);
    const targetTenant = targetColl.withTenant(data.targetTenant);

    const objects = (await srcTenant.query.fetchObjects())?.objects;
    if (objects && objects.length > 0) {
      await targetTenant.data.insertMany(objects);
    }

    subject.next({ data: `Copied tenant contents` });

    if (data.disableTenants) {
      await srcColl.tenants.update({
        name: data.sourceTenant,
        activityStatus: 'COLD',
      });
      await targetColl.tenants.update({
        name: data.targetTenant,
        activityStatus: 'COLD',
      });
    }

    subject.next({
      data: `Cloned in around ${(Date.now() - startTime) / 1000} seconds.\n`,
    });
    return `Cloned.`;
  }

  async copyCollection(
    data: CopyCollectionDto,
    subject: Subject<StatusMessage>,
  ) {
    const srcColl = this.client.collections.get(data.sourceCollection);
    const targetColl = this.client.collections.get(data.targetCollection);

    const startTime = Date.now();
    subject.next({
      data: `Copying ${data.sourceCollection} to ${data.targetCollection}\n`,
    });

    const sourceConfig = await srcColl.config.get();
    const targetConfig = await targetColl.config.get();

    if (
      sourceConfig.multiTenancy.enabled !== targetConfig.multiTenancy.enabled
    ) {
      subject.next({
        data: `One of the collections has multi-tenancy enabled while the other has not.\n`,
      });
      return `One of the collections has multi-tenancy enabled while the other has not.`;
    }

    if (targetConfig.multiTenancy.enabled) {
      // If multiTenancy is enabled, copy the tenants
      subject.next({ data: `Going tenant by tenant` });
      const tenants = await srcColl.tenants.get();

      // Go through each tenant
      for (const tenant of Object.values(tenants)) {
        if ((await targetColl.tenants.getByName(tenant.name)) == null) {
          // Create tenant in the target collection, if does not exist already
          await targetColl.tenants.create({ name: tenant.name });
          subject.next({ data: `Created tenant: ${tenant.name}` });
        }

        // Activate Tenants
        await srcColl.tenants.update({
          name: tenant.name,
          activityStatus: 'HOT',
        });
        await targetColl.tenants.update({
          name: tenant.name,
          activityStatus: 'HOT',
        });

        // Migrate objects from source tenant to target tenant
        const srcTenant = srcColl.withTenant(tenant.name);
        const targetTenant = targetColl.withTenant(tenant.name);
        const objects = (await srcTenant.query.fetchObjects())?.objects;

        if (objects && objects.length > 0) {
          await targetTenant.data.insertMany(objects);
        }

        subject.next({ data: `Copied tenant contents: ${tenant.name}` });

        if (data.disableTenants) {
          // Disable the tenants
          await srcColl.tenants.update({
            name: tenant.name,
            activityStatus: 'COLD',
          });
          await targetColl.tenants.update({
            name: tenant.name,
            activityStatus: 'COLD',
          });
        }
      }
    } else {
      // If multiTenancy is not enabled, clone the objects
      const objects = (await srcColl.query.fetchObjects())?.objects;
      if (objects && objects.length > 0) {
        await targetColl.data.insertMany(objects);
      }
    }

    subject.next({
      data: `Copied, in around ${(Date.now() - startTime) / 1000} seconds.\n`,
    });
    return `Copied ${data.sourceCollection} to ${data.targetCollection}`;
  }

  async copyTenant(data: CopyTenantDto, subject: Subject<StatusMessage>) {
    const srcColl = this.client.collections.get(data.sourceCollection);
    const targetColl = this.client.collections.get(data.targetCollection);

    const startTime = Date.now();
    subject.next({
      data: `Copying contents of ${data.sourceTenant} (from ${data.sourceCollection}) to ${data.targetTenant} (from ${data.targetCollection})\n`,
    });

    // Activate Tenants
    await srcColl.tenants.update({
      name: data.sourceTenant,
      activityStatus: 'HOT',
    });
    await targetColl.tenants.update({
      name: data.targetTenant,
      activityStatus: 'HOT',
    });

    const srcTenant = srcColl.withTenant(data.sourceTenant);
    const targetTenant = targetColl.withTenant(data.targetTenant);

    const objects = (await srcTenant.query.fetchObjects())?.objects;
    if (objects && objects.length > 0) {
      await targetTenant.data.insertMany(objects);
    }

    subject.next({ data: `Copied tenant contents` });

    if (data.disableTenants) {
      await srcColl.tenants.update({
        name: data.sourceTenant,
        activityStatus: 'COLD',
      });
      await targetColl.tenants.update({
        name: data.targetTenant,
        activityStatus: 'COLD',
      });
    }

    subject.next({
      data: `Copied in around ${(Date.now() - startTime) / 1000} seconds.\n`,
    });
    return `Copied.`;
  }

  async backup(data: BackupDto, subject: Subject<StatusMessage>) {
    if (data.collections.length === 0) {
      subject.next({
        data: `No collections selected for backup\n`,
      });
      return 'No collections selected for backup.';
    }

    // Enable tenants of all selected collections if chosen so.
    if (data.enableTenants) {
      try {
        subject.next({
          data: `Enabling all relevant tenants.\n`,
        });
        for (const collection of Object.values(data.collections)) {
          const coll = this.client.collections.get(collection);
          const tenants = await coll.tenants.get();

          const updatedTenants = [];

          for (const tenant of Object.values(tenants)) {
            updatedTenants.push({
              name: tenant.name,
              activityStatus: 'HOT',
            });
          }

          await coll.tenants.update(updatedTenants);
        }
      } catch (error) {
        subject.next({
          data: `Failed to enable tenants.\n`,
        });
        return 'Failed to enable tenants.';
      }
    }

    const backupId = data.backupId ?? uuidv4();

    subject.next({
      data: `Backing up with id: ${backupId}\n`,
    });

    try {
      await this.client.backup.create({
        backupId: backupId,
        backend: data.backend,
        waitForCompletion: true,
        includeCollections: data.collections,
      });
    } catch (error) {
      subject.next({
        data: `Back up failed! ${error}\n`,
      });
      return 'Back up failed!';
    }

    subject.next({
      data: `Back up complete!\n`,
    });
    return 'Back up complete!';
  }

  async restore(data: RestoreDto, subject: Subject<StatusMessage>) {
    subject.next({
      data: `Restoring with id: ${data.backupId}\n`,
    });

    try {
      await this.client.backup.restore({
        backupId: data.backupId,
        backend: data.backend,
        waitForCompletion: true,
      });
    } catch (error) {
      subject.next({
        data: `Restore failed! ${error}\n`,
      });
      return 'Restore failed!';
    }

    subject.next({
      data: `Restore complete!\n`,
    });
    return 'Restore complete!';
  }
}
