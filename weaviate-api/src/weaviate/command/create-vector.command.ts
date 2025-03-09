import { ICommand } from '@nestjs/cqrs';
import { CreateVectorDto } from '../dto/create-vector.dto';

export class CreateVectorCommand implements ICommand {
  constructor(readonly dto: CreateVectorDto) {}
}
