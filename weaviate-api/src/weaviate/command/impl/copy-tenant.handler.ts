import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CopyTenantCommand } from '../copy-tenant.command';
import {
  MigrationService,
  MigrationType,
} from '@/weaviate/services/migration.service';

@CommandHandler(CopyTenantCommand)
export class CopyTenantHandler implements ICommandHandler<CopyTenantCommand> {
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ dto }: CopyTenantCommand): Promise<string> {
    return this.migrationService.startProcess(MigrationType.copyTenant, dto);
  }
}
