import { Module } from '@nestjs/common';
import { WeaviateModule } from './weaviate/weaviate.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
      cache: true,
      expandVariables: true,
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    WeaviateModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('WEAVIATE_HTTP_HOST'),
        port: configService.get<number>('WEAVIATE_HTTP_PORT'),
        grpcHost: configService.get<string>('WEAVIATE_GRPC_HOST'),
        grpcPort: configService.get<number>('WEAVIATE_GRPC_PORT'),
        apiKey: configService.get<string>('WEAVIATE_API_KEY'),
        secure: configService.get<string>('WEAVIATE_HTTP_SECURE'),
        grpcSecure: configService.get<string>('WEAVIATE_GRPC_SECURE'),
        skipInitChecks: configService.get<string>('WEAVIATE_SKIP_INIT_CHECKS'),
        openaiApiKey: configService.get<string>('OPENAI_API_KEY'),
        weaviateContainerName: configService.get<string>('WEAVIATE_CONTAINER_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
