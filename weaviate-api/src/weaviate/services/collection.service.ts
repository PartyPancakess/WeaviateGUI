import { Injectable } from '@nestjs/common';
import { BaseWeaviateService } from './base.service';
import axios from 'axios';

@Injectable()
export class CollectionService extends BaseWeaviateService {
  async getCollections() {
    const list = await this.client.collections.listAll();
    return list.map((coll) => coll.name);
  }

  async getCollection(name: string): Promise<string> {
    const exists = await this.client.collections.exists(name);
    if (exists) {
      const config = await this.client.collections.get(name).config.get();
      return JSON.stringify(config, null, 2);
    }
    return '';
  }

  async createCollection(coll: any) {
    const meta = await this.client.getMeta();

    let hostname = meta.hostname.replace(
      'http://[::]:',
      `http://${this.config.weaviateHost}:`,
    );

    const options = {
      method: 'POST',
      url: `${hostname}/v1/schema`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.config.apiKey
          ? `Bearer ${this.config.apiKey}`
          : undefined,
      },
      data: coll,
    };

    try {
      await axios.request(options);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCollection(name: string) {
    await this.client.collections.delete(name);
  }

  async getCollectionJSON(name: string) {
    const meta = await this.client.getMeta();
    let hostname = meta.hostname.replace(
      'http://[::]:',
      `http://${this.config.weaviateHost}:`,
    );

    try {
      const response = await fetch(`${hostname}/v1/schema/${name}`, {
        method: 'GET',
        headers: {
          Authorization: this.config.apiKey
            ? `Bearer ${this.config.apiKey}`
            : undefined,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }

    return {};
  }

  async updateCollection(collName: string, config: any) {
    const meta = await this.client.getMeta();

    let hostname = meta.hostname.replace(
      'http://[::]:',
      `http://${this.config.weaviateHost}:`,
    );

    try {
      await fetch(`${hostname}/v1/schema/${collName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.config.apiKey
            ? `Bearer ${this.config.apiKey}`
            : undefined,
        },
        body: JSON.stringify(config),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
