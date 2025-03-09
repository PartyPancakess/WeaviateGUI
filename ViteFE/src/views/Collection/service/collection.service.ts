import { useHTTPService } from "@/services/http.service.ts";

export class CollectionService {
  constructor(private readonly httpService = useHTTPService()) {}

  async getCollectionSettings(name: string): Promise<any> {
    const response = await this.httpService.get(`weaviate/collection/${name}`);
    return response.data;
  }

  async deleteCollection(name: string): Promise<any> {
    const response = await this.httpService.delete(`weaviate/collection/`, {data: {name}});
    return response.data;
  }

  async getCollectionJSON(name: string): Promise<any> {
    const response = await this.httpService.get(`weaviate/collection-json/${name}`);
    return response.data;
  }

  async updateCollection(collectionName: string, config: any): Promise<any> {
    const response = await this.httpService.patch(`weaviate/collection`, {collectionName: collectionName, config: config});
    return response.status;
  }

  async getCollectionTenants(name: string): Promise<{name: string, status: string}[]> {
    const response = await this.httpService.get(`weaviate/collection/${name}/tenant-list`);
    return response.data;
  }

  async addTenant(collectionName: string, tenantName: string, status: 'COLD' | 'HOT' | 'FROZEN' = 'COLD'): Promise<number> {
    const response = await this.httpService.post(`weaviate/collection/tenant`, {collectionName, tenantName, status});
    return response.status;
  }

  async remoteTenant(collectionName: string, tenantName: string): Promise<any> {
    const response = await this.httpService.delete(`weaviate/collection/tenant`, {data: {collectionName: collectionName, tenantName}});
    return response.status;
  }

  async updateTenant(collectionName: string, tenantName: string, status: any): Promise<any> {
    const response = await this.httpService.patch(`weaviate/collection/tenant`, {collectionName: collectionName, tenantName, status});
    return response.status;
  }

  async getTenant(collectionName: string, tenantName: string): Promise<{name: string, status: any}> {
    const response = await this.httpService.get(`weaviate/collection/${collectionName}/tenant/${tenantName}`);
    return response.data;
  }
}

export function useCollectionService() {
  return new CollectionService();
}
