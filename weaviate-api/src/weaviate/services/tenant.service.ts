import { Injectable } from '@nestjs/common';
import { BaseWeaviateService } from './base.service';

@Injectable()
export class TenantService extends BaseWeaviateService {
  async getTenants(name: string): Promise<{ name: string; status: string }[]> {
    try {
      const list = await this.client.collections.get(name).tenants.get();
      return Object.entries(list).map(([_, v]) => ({
        name: v.name,
        status: v.activityStatus,
      }));
    } catch (_error) {}
    return [];
  }

  async getTenant(
    collectionName: string,
    tenantName: string,
  ): Promise<{ name: string; status: string }> {
    const tenant = await this.client.collections
      .get(collectionName)
      .tenants.getByName(tenantName);
    return {
      name: tenant.name,
      status: tenant.activityStatus,
    };
  }

  async addTenant(
    collection: string,
    tenant: string,
    activityStatus: 'HOT' | 'COLD' | 'FROZEN' = 'COLD',
  ) {
    await this.client.collections
      .get(collection)
      .tenants.create({ name: tenant, activityStatus: activityStatus });
  }

  async deleteTenant(collection: string, tenant: string) {
    await this.client.collections.get(collection).tenants.remove(tenant);
  }

  async updateTenant(
    collection: string,
    tenant: string,
    status: 'HOT' | 'COLD' | 'FROZEN',
  ) {
    await this.client.collections.get(collection).tenants.update({
      name: tenant,
      activityStatus: status,
    });
  }
}
