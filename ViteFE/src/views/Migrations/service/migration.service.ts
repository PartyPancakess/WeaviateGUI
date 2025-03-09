import { useHTTPService } from "@/services/http.service";

export class MigrationService {
  constructor(private readonly httpService = useHTTPService()) {}

  createEventSource(processId: string): EventSource {
    return new EventSource(
      `${
        import.meta.env.VITE_APP_SERVER_BASEURL
      }weaviate/migration/status/?processId=${processId}`
    );
  }

  async cloneCollection(
    collectionName: string,
    cloneName: string,
    disableTenants: boolean
  ): Promise<string> {
    const response = await this.httpService.post(
      `weaviate/migration/clone-collection-start`,
      { collectionName, cloneName, disableTenants }
    );
    return response.data;
  }

  async cloneTenant(
    sourceCollection: string,
    targetCollection: string,
    sourceTenant: string,
    targetTenant: string,
    disableTenants: boolean
  ): Promise<string> {
    const response = await this.httpService.post(
      `weaviate/migration/clone-tenant-start`,
      {
        sourceCollection,
        targetCollection,
        sourceTenant,
        targetTenant,
        disableTenants,
      }
    );
    return response.data;
  }

  async copyCollection(
    sourceCollection: string,
    targetCollection: string,
    disableTenants: boolean
  ): Promise<string> {
    const response = await this.httpService.post(
      `weaviate/migration/copy-collection-start`,
      { sourceCollection, targetCollection, disableTenants }
    );
    return response.data;
  }

  async copyTenant(
    sourceCollection: string,
    targetCollection: string,
    sourceTenant: string,
    targetTenant: string,
    disableTenants: boolean
  ): Promise<string> {
    const response = await this.httpService.post(
      `weaviate/migration/copy-tenant-start`,
      {
        sourceCollection,
        targetCollection,
        sourceTenant,
        targetTenant,
        disableTenants,
      }
    );
    return response.data;
  }

  async backup(
    collections: string[],
    backend: "filesystem" | "s3" | "gcs" | "azure",
    enableTenants: boolean,
    backupId?: string
  ): Promise<string> {
    const response = await this.httpService.post(`weaviate/migration/backup`, {
      backupId,
      collections,
      backend,
      enableTenants,
    });
    return response.data;
  }

  async restore(
    backend: "filesystem" | "s3" | "gcs" | "azure",
    backupId: string
  ): Promise<string> {
    const response = await this.httpService.post(`weaviate/migration/restore`, {
      backupId,
      backend,
    });
    return response.data;
  }
}

export function useMigrationService() {
  return new MigrationService();
}
