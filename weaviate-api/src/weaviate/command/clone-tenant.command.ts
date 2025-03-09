import { ICommand } from '@nestjs/cqrs';
import { CloneTenantDto } from '../dto/clone-tenant.dto';

export class CloneTenantCommand implements ICommand {
  constructor(readonly dto: CloneTenantDto) {}
}
