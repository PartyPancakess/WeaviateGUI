import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CloneTenantCommand } from '../clone-tenant.command';
import {
  MigrationService,
  MigrationType,
} from '@/weaviate/services/migration.service';

@CommandHandler(CloneTenantCommand)
export class CloneTenantHandler
  implements ICommandHandler<CloneTenantCommand>
{
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ dto }: CloneTenantCommand): Promise<string> {
    return this.migrationService.startProcess(
      MigrationType.cloneTenant,
      dto,
    );
  }
}
