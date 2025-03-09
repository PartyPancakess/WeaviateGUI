import { ICommand } from '@nestjs/cqrs';
import { UpdateCollectionDto } from '../dto/update-collection.dto';

export class UpdateCollectionCommand implements ICommand {
  constructor(readonly dto: UpdateCollectionDto) {}
}
