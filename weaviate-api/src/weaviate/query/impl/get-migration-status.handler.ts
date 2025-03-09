import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMigrationStatusQuery } from '../get-migration-status.query';
import {
  MigrationService,
  StatusMessage,
} from '@/weaviate/services/migration.service';
import { Observable } from 'rxjs';

@QueryHandler(GetMigrationStatusQuery)
export class GetMigrationStatusHandler
  implements IQueryHandler<GetMigrationStatusQuery>
{
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ processId }): Promise<Observable<StatusMessage>> {
    return this.migrationService.getProcessStatus(processId);
  }
}
