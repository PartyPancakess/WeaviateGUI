import { ICommand } from "@nestjs/cqrs";
import { DeleteTenantDto } from "../dto/delete-tenant.dto";

export class DeleteTenantCommand implements ICommand {
  constructor(
    readonly dto: DeleteTenantDto,
  ) {}
}
