import { IQuery } from '@nestjs/cqrs';

export class GetCollectionJSONQuery implements IQuery {
  constructor(readonly name: string) {}
}
