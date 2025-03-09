import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDBInfoQuery } from '../get-db-info.query';
import { WeaviateService } from '@/weaviate/weaviate.service';

@QueryHandler(GetDBInfoQuery)
export class GetDBInfoHandler
  implements IQueryHandler<GetDBInfoQuery>
{
  constructor(private readonly weaviateService: WeaviateService) {}

  async execute(): Promise<any> {
    return await this.weaviateService.getDBInfo();
  }
}
