import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVectorCommand } from '../update-vector.command';
import { VectorService } from '@/weaviate/services/vector.service';

@CommandHandler(UpdateVectorCommand)
export class UpdateVectorHandler
  implements ICommandHandler<UpdateVectorCommand>
{
  constructor(private readonly vectorService: VectorService) {}

  async execute({ dto }: UpdateVectorCommand): Promise<any> {
    return await this.vectorService.editVector(dto);
  }
}
