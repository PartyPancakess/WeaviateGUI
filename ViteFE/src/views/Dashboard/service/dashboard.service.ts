import { useHTTPService } from "@/services/http.service.ts";
import { DBInfoDto } from "../dto/db-info.dto";

export class DashboardService {
  constructor(private readonly httpService = useHTTPService()) {}

  async getDBInfo(): Promise<DBInfoDto> {
    const response = await this.httpService.get("weaviate/db-info");
    return response.data;
  }
}

export function useDashboardService() {
  return new DashboardService();
}
