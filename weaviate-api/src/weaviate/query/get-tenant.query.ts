import { IQuery } from '@nestjs/cqrs';

export class GetTenantQuery implements IQuery {
  constructor(readonly collectionName: string, readonly tenantName: string) {}
}
