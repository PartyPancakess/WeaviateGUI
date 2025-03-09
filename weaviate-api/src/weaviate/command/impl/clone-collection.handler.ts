import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CloneCollectionCommand } from '../clone-collection.command';
import {
  MigrationService,
  MigrationType,
} from '@/weaviate/services/migration.service';

@CommandHandler(CloneCollectionCommand)
export class CloneCollectionHandler
  implements ICommandHandler<CloneCollectionCommand>
{
  constructor(private readonly migrationService: MigrationService) {}

  async execute({ dto }: CloneCollectionCommand): Promise<string> {
    return this.migrationService.startProcess(
      MigrationType.cloneCollection,
      dto,
    );
  }
}
