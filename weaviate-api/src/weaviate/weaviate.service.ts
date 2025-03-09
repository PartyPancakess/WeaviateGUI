import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import weaviate, { type WeaviateClient } from 'weaviate-client';
import { WeaviateOptions } from './weaviate.options';
import { MODULE_OPTIONS_TOKEN } from './weaviate.module-definition';

@Injectable()
export class WeaviateService implements OnModuleInit {
  client: WeaviateClient;
  config: {
    host: string;
    port?: number;
    apiKey?: string;
    weaviateHost: string;
  };

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: WeaviateOptions,
  ) {}

  async onModuleInit(): Promise<any> {
    if (
      this.options.host &&
      this.options.host !== 'localhost' &&
      this.options.host !== 'host.docker.internal'
    ) {
      console.log('Connecting to custom Weaviate instance');
      this.client = await weaviate.connectToCustom({
        httpHost: this.options.host,
        httpPort: this.options.port,
        httpSecure: this.options.secure ?? true,
        grpcHost: this.options.grpcHost,
        grpcPort: this.options.grpcPort,
        authCredentials: this.options.apiKey
          ? new weaviate.ApiKey(this.options.apiKey)
          : undefined,
        headers: this.options.openaiApiKey
          ? {
              'X-OpenAI-Api-Key': this.options.openaiApiKey,
            }
          : undefined,
        skipInitChecks: this.options.skipInitChecks ?? true,
      });
    } else {
      console.log('Connecting to local Weaviate instance');
      this.client = await weaviate.connectToLocal({
        host: this.options.host ?? 'localhost',
        port: this.options.port,
        authCredentials: this.options.apiKey
          ? new weaviate.ApiKey(this.options.apiKey)
          : undefined,
        headers: this.options.openaiApiKey
          ? {
              'X-OpenAI-Api-Key': this.options.openaiApiKey,
            }
          : undefined,
      });
    }

    const hostName = this.options.host
      ? this.options.host === 'host.docker.internal'
        ? 'localhost'
        : this.options.host
      : 'localhost';

    this.config = {
      host: hostName,
      port: this.options.port,
      apiKey: this.options.apiKey,
      weaviateHost: this.options.weaviateContainerName ?? hostName,
    };
  }

  getClient(): WeaviateClient {
    if (!this.client) {
      throw new Error('WeaviateClient is not initialized yet.');
    }
    return this.client;
  }

  async getDBInfo() {
    const [meta, isLive, isReady] = await Promise.all([
      this.client.getMeta(),
      this.client.isLive(),
      this.client.isReady(),
    ]);
    const info = {
      version: meta.version,
      connection: meta.hostname,
      isLive,
      isReady,
    };

    return info;
  }
}
