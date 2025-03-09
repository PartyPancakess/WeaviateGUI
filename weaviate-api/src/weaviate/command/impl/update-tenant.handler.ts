import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTenantCommand } from '../update-tenant.command';
import { TenantService } from '@/weaviate/services/tenant.service';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler
  implements ICommandHandler<UpdateTenantCommand>
{
  constructor(private readonly tenantService: TenantService) {}

  async execute({ dto }: UpdateTenantCommand): Promise<any> {
    return await this.tenantService.updateTenant(dto.collectionName, dto.tenantName, dto.status);
  }
}
