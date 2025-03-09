import { ICommand } from '@nestjs/cqrs';
import { DeleteVectorDto } from '../dto/delete-vector.dto';

export class DeleteVectorsCommand implements ICommand {
  constructor(readonly dto: DeleteVectorDto) {}
}
