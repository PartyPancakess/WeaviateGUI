import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVectorCommand } from '../create-vector.command';
import { VectorService } from '@/weaviate/services/vector.service';

@CommandHandler(CreateVectorCommand)
export class CreateVectorHandler
  implements ICommandHandler<CreateVectorCommand>
{
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }: CreateVectorCommand): Promise<any> {
    return await this.vectorService.addVector(dto);
  }
}
