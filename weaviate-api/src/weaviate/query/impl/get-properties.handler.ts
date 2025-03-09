import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VectorService } from '@/weaviate/services/vector.service';
import { GetPropertiesQuery } from '../get-properties.query';

@QueryHandler(GetPropertiesQuery)
export class GetPropertiesHandler implements IQueryHandler<GetPropertiesQuery> {
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }): Promise<any[]> {
    return await this.vectorService.getProperties(dto);
  }
}
