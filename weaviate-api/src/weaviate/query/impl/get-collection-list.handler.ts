import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCollectionListQuery } from '../get-collection-list.query';
import { CollectionService } from '@/weaviate/services/collection.service';

@QueryHandler(GetCollectionListQuery)
export class GetCollectionListHandler
  implements IQueryHandler<GetCollectionListQuery>
{
  constructor(private readonly collectionService: CollectionService) {}

  async execute(): Promise<string[]> {
    return await this.collectionService.getCollections();
  }
}
