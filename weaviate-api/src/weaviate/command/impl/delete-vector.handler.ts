import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VectorService } from '@/weaviate/services/vector.service';
import { DeleteVectorCommand } from '../delete-vector.command';

@CommandHandler(DeleteVectorCommand)
export class DeleteVectorHandler
  implements ICommandHandler<DeleteVectorCommand>
{
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }: DeleteVectorCommand): Promise<any> {
    return await this.vectorService.deleteVector(dto);
  }
}
