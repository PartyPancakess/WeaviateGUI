import { ICommand } from '@nestjs/cqrs';
import { CloneCollectionDto } from '../dto/clone-collection.dto';

export class CloneCollectionCommand implements ICommand {
  constructor(readonly dto: CloneCollectionDto) {}
}
