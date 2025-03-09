import { ICommand } from "@nestjs/cqrs";
import { CreateTenantDto } from "../dto/create-tenant.dto";

export class CreateTenantCommand implements ICommand {
  constructor(
    readonly dto: CreateTenantDto,
  ) {}
}
