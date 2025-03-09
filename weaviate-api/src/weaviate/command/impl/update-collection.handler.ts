import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCollectionCommand } from '../update-collection.command';
import { CollectionService } from '@/weaviate/services/collection.service';

@CommandHandler(UpdateCollectionCommand)
export class UpdateCollectionHandler
  implements ICommandHandler<UpdateCollectionCommand>
{
  constructor(private readonly collectionService: CollectionService) {}

  async execute({ dto }: UpdateCollectionCommand): Promise<any> {
    return await this.collectionService.updateCollection(
      dto.collectionName,
      dto.config,
    );
  }
}
