import { Module } from '@nestjs/common';
import { WeaviateController } from './weaviate.controller';
import { ConfigurableModuleClass } from '@/weaviate/weaviate.module-definition';
import { WeaviateService } from '@/weaviate/weaviate.service';
import { CommandHandlers } from '@/weaviate/command';
import { Services } from './services';
import { QueryHandlers } from './query';

@Module({
  imports: [],
  controllers: [WeaviateController],
  providers: [WeaviateService, ...Services, ...CommandHandlers, ...QueryHandlers],
})
export class WeaviateModule extends ConfigurableModuleClass {}
