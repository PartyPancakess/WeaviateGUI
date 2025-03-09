import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantService } from '@/weaviate/services/tenant.service';
import { DeleteTenantCommand } from '../delete-tenant.command';

@CommandHandler(DeleteTenantCommand)
export class DeleteTenantHandler
  implements ICommandHandler<DeleteTenantCommand>
{
  constructor(private readonly tenantService: TenantService) {}

  async execute({ dto }: DeleteTenantCommand): Promise<any> {
    return await this.tenantService.deleteTenant(dto.collectionName, dto.tenantName);
  }
}
