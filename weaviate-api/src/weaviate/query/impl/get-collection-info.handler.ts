import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCollectionInfoQuery } from '../get-collection-info.query';
import { CollectionService } from '@/weaviate/services/collection.service';

@QueryHandler(GetCollectionInfoQuery)
export class GetCollectionInfoHandler
  implements IQueryHandler<GetCollectionInfoQuery>
{
  constructor(private readonly collectionService: CollectionService) {}

  async execute({ name }): Promise<string> {
    return this.collectionService.getCollection(name);
  }
}
