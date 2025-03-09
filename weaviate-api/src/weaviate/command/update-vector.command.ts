import { ICommand } from "@nestjs/cqrs";
import { EditVectorDto } from "../dto/edit-vector.dto";

export class UpdateVectorCommand implements ICommand {
  constructor(
    readonly dto: EditVectorDto,
  ) {}
}
