import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTenantQuery } from '../get-tenant.query';
import { TenantService } from '@/weaviate/services/tenant.service';

@QueryHandler(GetTenantQuery)
export class GetTenantHandler implements IQueryHandler<GetTenantQuery> {
  constructor(private readonly tenantService: TenantService) {}

  async execute({ collectionName, tenantName }): Promise<{
    name: string;
    status: string;
  }> {
    return await this.tenantService.getTenant(collectionName, tenantName);
  }
}
