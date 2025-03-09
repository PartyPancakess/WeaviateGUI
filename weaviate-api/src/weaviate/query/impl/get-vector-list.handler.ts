import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVectorListQuery } from '../get-vector-list.query';
import { VectorService } from '@/weaviate/services/vector.service';

@QueryHandler(GetVectorListQuery)
export class GetVectorListHandler implements IQueryHandler<GetVectorListQuery> {
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }): Promise<string[]> {
    return await this.vectorService.getVectors(dto);
  }
}
