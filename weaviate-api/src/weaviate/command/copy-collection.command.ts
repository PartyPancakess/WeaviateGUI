import { ICommand } from '@nestjs/cqrs';
import { CopyCollectionDto } from '../dto/copy-collection.dto';

export class CopyCollectionCommand implements ICommand {
  constructor(readonly dto: CopyCollectionDto) {}
}
