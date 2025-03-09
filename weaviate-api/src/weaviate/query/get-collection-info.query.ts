import { IQuery } from '@nestjs/cqrs';

export class GetCollectionInfoQuery implements IQuery {
  constructor(readonly name: string) {}
}
