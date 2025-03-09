import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCollectionJSONQuery } from '../get-collection-json.query';
import { CollectionService } from '@/weaviate/services/collection.service';

@QueryHandler(GetCollectionJSONQuery)
export class GetCollectionJSONHandler
  implements IQueryHandler<GetCollectionJSONQuery>
{
  constructor(private readonly collectionService: CollectionService) {}

  async execute({ name }): Promise<string> {
    return this.collectionService.getCollectionJSON(name);
  }
}
