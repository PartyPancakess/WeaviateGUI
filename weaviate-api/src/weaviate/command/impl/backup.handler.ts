import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  MigrationService,
  MigrationType,
} from '@/weaviate/services/migration.service';
import { BackupCommand } from '../backup.command';

@CommandHandler(BackupCommand)
export class BackupHandler implements ICommandHandler<BackupCommand> {
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ dto }: BackupCommand): Promise<string> {
    return this.migrationService.startProcess(MigrationType.backup, dto);
  }
}
