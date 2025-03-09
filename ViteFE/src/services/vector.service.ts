import { FilterGroupModel } from "@/interface/filter.interface";
import { useHTTPService } from "@/services/http.service.ts";

export class VectorService {
  constructor(private readonly httpService = useHTTPService()) {}

  async getProperties(
    collectionName: string,
    tenantName?: string
  ): Promise<{ name: string; dataType: string }[]> {
    const response = await this.httpService.get("weaviate/properties", {
      params: {
        collectionName,
        tenantName,
      },
    });
    return response.data;
  }

  async getVectorCount(params: {
    collectionName: string;
    tenantName?: string;
    query?: string;
    filter?: FilterGroupModel;
    searchType?: "keyword" | "nearVector" | "nearText";
  }): Promise<number | undefined> {
    if (params.searchType === undefined || params.searchType === "keyword") {
      const response = await this.httpService.get("weaviate/vector-count", {
        params: {
          collectionName: params.collectionName,
          tenantName: params.tenantName,
          query: params.query,
          filter: JSON.stringify(params.filter),
          searchType: params.searchType,
        },
      });
      return response.data;
    }
    return undefined;
  }

  async getVectorList(params: {
    collectionName: string;
    includeVector: boolean;
    tenantName?: string;
    limit?: number;
    offset?: number;
    query?: string;
    filter?: FilterGroupModel;
    searchType?: "keyword" | "nearVector" | "nearText";
    maxDistance?: number | null;
  }): Promise<any[]> {
    const response = await this.httpService.get("weaviate/vectors", {
      params: {
        collectionName: params.collectionName,
        includeVector: params.includeVector,
        tenantName: params.tenantName,
        limit: params.limit,
        offset: params.offset,
        query: params.query,
        filter: JSON.stringify(params.filter),
        searchType: params.searchType,
        maxDistance: params.maxDistance ?? undefined,
      },
    });
    return response.data;
  }

  async addVector(params: {
    collectionName: string;
    data: {
      properties: { [key: string]: any };
      customId?: string;
      vectors?: number[] | { [key: string]: number[] };
    };
    tenantName?: string;
  }): Promise<any[]> {
    const response = await this.httpService.post("weaviate/vector", {
      ...params,
    });
    return response.data;
  }

  async editVector(params: {
    collectionName: string;
    tenantName?: string;
    properties: { [key: string]: any };
    vectorId?: string;
    vectors?: number[] | { [key: string]: number[] };
  }): Promise<any[]> {
    const response = await this.httpService.patch("weaviate/vector", {
      ...params,
    });
    return response.data;
  }

  async deleteVector(params: {
    collectionName: string;
    vectorIds: string[];
    tenantName?: string;
  }): Promise<any[]> {
    const response = await this.httpService.delete("weaviate/vector", {
      data: params,
    });
    return response.data;
  }

  async deleteVectors(params: {
    collectionName: string;
    tenantName?: string;
  }): Promise<any[]> {
    const response = await this.httpService.delete("weaviate/vectors", {
      data: params,
    });
    return response.data;
  }
}

export function useVectorService() {
  return new VectorService();
}
