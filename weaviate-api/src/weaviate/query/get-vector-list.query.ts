import { IQuery } from '@nestjs/cqrs';
import { GetVectorListDto } from '../dto/get-vector-list.dto';

export class GetVectorListQuery implements IQuery {
  constructor(
    readonly dto: GetVectorListDto
  ) {}
}
