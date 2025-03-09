import { ICommand } from '@nestjs/cqrs';
import { DeleteVectorDto } from '../dto/delete-vector.dto';

export class DeleteVectorCommand implements ICommand {
  constructor(readonly dto: DeleteVectorDto) {}
}
