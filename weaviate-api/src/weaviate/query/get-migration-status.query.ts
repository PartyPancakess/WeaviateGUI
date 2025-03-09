import { IQuery } from '@nestjs/cqrs';

export class GetMigrationStatusQuery implements IQuery {
  constructor(readonly processId: string) {}
}
