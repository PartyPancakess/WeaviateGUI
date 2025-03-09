import { IQuery } from '@nestjs/cqrs';

export class GetTenantListQuery implements IQuery {
  constructor(readonly collectionName: string) {}
}
