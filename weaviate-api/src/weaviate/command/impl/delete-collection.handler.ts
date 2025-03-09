import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CollectionService } from '@/weaviate/services/collection.service';
import { DeleteCollectionCommand } from '../delete-collection.command';

@CommandHandler(DeleteCollectionCommand)
export class DeleteCollectionHandler
  implements ICommandHandler<DeleteCollectionCommand>
{
  constructor(private readonly collectionService: CollectionService) {}

  async execute({ dto }: DeleteCollectionCommand): Promise<any> {
    return await this.collectionService.deleteCollection(dto.name);
  }
}
