import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTenantCommand } from '../create-tenant.command';
import { TenantService } from '@/weaviate/services/tenant.service';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler
  implements ICommandHandler<CreateTenantCommand>
{
  constructor(private readonly tenantService: TenantService) {}

  async execute({ dto }: CreateTenantCommand): Promise<any> {
    return await this.tenantService.addTenant(dto.collectionName, dto.tenantName, dto.status);
  }
}
