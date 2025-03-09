import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  MigrationService,
  MigrationType,
} from '@/weaviate/services/migration.service';
import { RestoreCommand } from '../restore.command';

@CommandHandler(RestoreCommand)
export class RestoreHandler implements ICommandHandler<RestoreCommand> {
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ dto }: RestoreCommand): Promise<string> {
    return this.migrationService.startProcess(MigrationType.restore, dto);
  }
}
