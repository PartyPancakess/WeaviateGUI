import { WeaviateClient } from 'weaviate-client';
import { Injectable } from '@nestjs/common';
import { WeaviateService } from '../weaviate.service';

@Injectable()
export abstract class BaseWeaviateService {
  protected get client(): WeaviateClient {
    return this.weaviateService.client;
  }
  protected get config(): {
    host: string;
    weaviateHost: string;
    port?: number;
    apiKey?: string;
  } {
    return this.weaviateService.config;
  }

  constructor(protected readonly weaviateService: WeaviateService) {}
}
