import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCollectionCommand } from '../create-collection.command';
import { CollectionService } from '@/weaviate/services/collection.service';

@CommandHandler(CreateCollectionCommand)
export class CreateCollectionHandler
  implements ICommandHandler<CreateCollectionCommand>
{
  constructor(private readonly collectionService: CollectionService) {}

  async execute({ dto }: CreateCollectionCommand): Promise<any> {
    return await this.collectionService.createCollection(dto.collection);
  }
}
