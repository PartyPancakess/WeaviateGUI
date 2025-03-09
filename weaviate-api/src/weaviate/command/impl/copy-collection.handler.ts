import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CopyCollectionCommand } from '../copy-collection.command';
import {
  MigrationService,
  MigrationType,
} from '@/weaviate/services/migration.service';

@CommandHandler(CopyCollectionCommand)
export class CopyCollectionHandler
  implements ICommandHandler<CopyCollectionCommand>
{
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ dto }: CopyCollectionCommand): Promise<string> {
    return this.migrationService.startProcess(
      MigrationType.copyCollection,
      dto,
    );
  }
}
