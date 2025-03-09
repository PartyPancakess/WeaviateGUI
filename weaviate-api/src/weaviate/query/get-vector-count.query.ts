import { IQuery } from '@nestjs/cqrs';
import { GetVectorCountDto } from '../dto/get-vector-count.dto';

export class GetVectorCountQuery implements IQuery {
  constructor(
    readonly dto: GetVectorCountDto
  ) {}
}
