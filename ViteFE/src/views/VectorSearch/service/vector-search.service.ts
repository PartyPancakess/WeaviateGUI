import { useHTTPService } from "@/services/http.service";

export class VectorSearchService {
  constructor(private readonly httpService = useHTTPService()) {}

  async getCollectionNames(): Promise<string[]> {
    const response = await this.httpService.get("weaviate/collection-list");
    return response.data;
  }

  async getTenantNames(collectionName: string): Promise<string[] | undefined> {
    const response = await this.httpService.get(
      `weaviate/collection/${collectionName}/tenant-list`
    );
    return response.data.map((tenant: any) => tenant.name);
  }
}

export function useVectorSearchService() {
  return new VectorSearchService();
}
