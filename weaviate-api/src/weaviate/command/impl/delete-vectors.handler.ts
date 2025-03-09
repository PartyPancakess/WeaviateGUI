import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VectorService } from '@/weaviate/services/vector.service';
import { DeleteVectorsCommand } from '../delete-vectors.command';

@CommandHandler(DeleteVectorsCommand)
export class DeleteVectorsHandler
  implements ICommandHandler<DeleteVectorsCommand>
{
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }: DeleteVectorsCommand): Promise<any> {
    return await this.vectorService.deleteVectors(dto);
  }
}
