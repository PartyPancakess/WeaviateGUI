import { ICommand } from "@nestjs/cqrs";
import { CreateCollectionDto } from "../dto/create-collection.dto";

export class CreateCollectionCommand implements ICommand {
  constructor(
    readonly dto: CreateCollectionDto,
  ) {}
}
