import { ICommand } from "@nestjs/cqrs";
import { DeleteCollectionDto } from "../dto/delete-collection.dto";

export class DeleteCollectionCommand implements ICommand {
  constructor(
    readonly dto: DeleteCollectionDto,
  ) {}
}
