import { useHTTPService } from "@/services/http.service.ts";

export class CollectionListService {
  constructor(private readonly httpService = useHTTPService()) {}

  async getCollectionList(): Promise<string[]> {
    const response = await this.httpService.get("weaviate/collection-list");
    return response.data;
  }

  async createCollection(coll: string): Promise<any> {
    const response = await this.httpService.post("weaviate/collection", {
      collection: coll,
    });
    return response.data;
  }
}

export function useCollectionListService() {
  return new CollectionListService();
}
