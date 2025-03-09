import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTenantListQuery } from '../get-tenant-list.query';
import { TenantService } from '@/weaviate/services/tenant.service';

@QueryHandler(GetTenantListQuery)
export class GetTenantListHandler implements IQueryHandler<GetTenantListQuery> {
  constructor(private readonly tenantService: TenantService) {}

  async execute({ collectionName }): Promise<
    {
      name: string;
      status: string;
    }[]
  > {
    return await this.tenantService.getTenants(collectionName);
  }
}
