import { ICommand } from '@nestjs/cqrs';
import { CopyTenantDto } from '../dto/copy-tenant.dto';

export class CopyTenantCommand implements ICommand {
  constructor(readonly dto: CopyTenantDto) {}
}
