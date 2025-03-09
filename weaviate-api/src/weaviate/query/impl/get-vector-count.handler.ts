import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VectorService } from '@/weaviate/services/vector.service';
import { GetVectorCountQuery } from '../get-vector-count.query';

@QueryHandler(GetVectorCountQuery)
export class GetVectorCountHandler implements IQueryHandler<GetVectorCountQuery> {
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }): Promise<number> {
    return await this.vectorService.getVectorCount(dto);
  }
}
