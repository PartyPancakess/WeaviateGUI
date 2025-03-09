import { IQuery } from '@nestjs/cqrs';
import { GetPropertiesDto } from '../dto/get-properties.dto';

export class GetPropertiesQuery implements IQuery {
  constructor(
    readonly dto: GetPropertiesDto
  ) {}
}
