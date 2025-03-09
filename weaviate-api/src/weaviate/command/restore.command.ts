import { ICommand } from '@nestjs/cqrs';
import { RestoreDto } from '../dto/restore.dto';

export class RestoreCommand implements ICommand {
  constructor(readonly dto: RestoreDto) {}
}
