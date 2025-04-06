import { Injectable } from '@nestjs/common';
import { BaseWeaviateService } from './base.service';
import { GetVectorListDto } from '../dto/get-vector-list.dto';
import { CreateVectorDto } from '../dto/create-vector.dto';
import { GetVectorCountDto } from '../dto/get-vector-count.dto';
import { WeaviateReturn } from 'weaviate-client';
import { FilterGroupModel } from '../model/filter.model';
import { createFilterValue } from '../util/utils';
import { DeleteVectorDto } from '../dto/delete-vector.dto';
import { EditVectorDto } from '../dto/edit-vector.dto';

@Injectable()
export class VectorService extends BaseWeaviateService {
  async getProperties(
    dto: GetVectorCountDto,
  ): Promise<{ name: string; dataType: string }[]> {
    let collection = this.client.collections.get(dto.collectionName);
    if (dto.tenantName) {
      collection = collection.withTenant(dto.tenantName);
    }

    const props = (await collection.config.get()).properties.map((prop) => ({
      name: prop.name,
      dataType: prop.dataType,
    }));

    return props;
  }

  async getVectors(dto: GetVectorListDto): Promise<any[]> {
    let collection = this.client.collections.get(dto.collectionName);
    if (dto.tenantName) {
      collection = collection.withTenant(dto.tenantName);
    }

    if (typeof dto.includeVector === 'string') {
      // did not want to work otherwise
      dto.includeVector = dto.includeVector === 'true';
    }

    const maxItems = await collection.length();

    const options = {
      limit: dto.limit ? Math.min(dto.limit, maxItems) : undefined,
      offset: dto.offset || undefined,
      includeVector: dto.includeVector,
      distance: dto.maxDistance,
      returnMetadata: ['creationTime', 'updateTime'],
      filters: dto.filter
        ? createFilterValue(
            JSON.parse(dto.filter) as FilterGroupModel,
            collection,
          )
        : undefined,
    };

    let list: WeaviateReturn<undefined>;

    try {
      if (!dto.query) {
        list = await collection.query.fetchObjects(options as any);
      } else {
        if (dto.searchType == null || dto.searchType === 'keyword') {
          options.returnMetadata.push('score');
          list = await collection.query.bm25(
            dto.query as string,
            options as any,
          );
        } else if (dto.searchType === 'nearVector') {
          options.returnMetadata.push('distance');
          options.returnMetadata.push('certainty');
          list = await collection.query.nearVector(
            JSON.parse(dto.query) as number[],
            options as any,
          );
        } else if (dto.searchType === 'nearText') {
          options.returnMetadata.push('distance');
          options.returnMetadata.push('certainty');
          list = await collection.query.nearText(dto.query, options as any);
        }
      }

      return list.objects;
    } catch (error) {
      return [];
    }
  }

  async getVectorCount(dto: GetVectorCountDto): Promise<number> {
    let collection = this.client.collections.get(dto.collectionName);
    if (dto.tenantName) {
      collection = collection.withTenant(dto.tenantName);
    }

    try {
      const itemCount = await collection.length();
      if (itemCount === 0) {
        return 0;
      }
      if ((dto.query === undefined || dto.query.length === 0) && !dto.filter) {
        return itemCount;
      }

      if (dto.query === undefined || dto.query.length === 0) {
        const list = await collection.query.fetchObjects({
          includeVector: false,
          returnProperties: [],
          filters: dto.filter
            ? createFilterValue(
                JSON.parse(dto.filter) as FilterGroupModel,
                collection,
              )
            : undefined,
          limit: itemCount, // TODO: check if this causes issues if itemCount is too big
        });
        return list.objects.length;
      }

      const list = await collection.query.bm25(dto.query, {
        includeVector: false,
        returnProperties: [],
        filters: dto.filter
          ? createFilterValue(
              JSON.parse(dto.filter) as FilterGroupModel,
              collection,
            )
          : undefined,
        limit: itemCount,
      });
      return list.objects.length;
    } catch (error) {
      return 0;
    }
  }

  async addVector(vector: CreateVectorDto): Promise<string> {
    let collection = this.client.collections.get(vector.collectionName);
    if (vector.tenantName) {
      collection = collection.withTenant(vector.tenantName);
    }

    const config = await collection.config.get();

    const propertyMap = new Map(
      config.properties.map((prop) => [prop.name, prop.dataType]),
    );

    const castedProperties = Object.fromEntries(
      Object.entries(vector.data.properties).map(([key, value]) => {
        const dataType = propertyMap.get(key);
        if (dataType.endsWith('[]')) {
          return [key, JSON.parse(value)];
        } else if (dataType === 'number' || dataType === 'int') {
          return [key, Number(value)];
        } else if (dataType === 'boolean') {
          return [key, Boolean(value)];
        } else if (dataType === 'object') {
          return [key, JSON.parse(value)];
        } else {
          return [key, String(value)];
        }
      }),
    );

    return await collection.data.insert({
      id: vector.data.customId,
      properties: castedProperties,
      vectors: vector.data.vectors,
    });
  }

  // delete selected vectors
  async deleteVector(vector: DeleteVectorDto): Promise<any> {
    let collection = this.client.collections.get(vector.collectionName);
    if (vector.tenantName) {
      collection = collection.withTenant(vector.tenantName);
    }

    return await collection.data.deleteMany(
      collection.filter.byId().containsAny(vector.vectorIds),
    );
  }

  // delete all vectors
  async deleteVectors(vector: DeleteVectorDto): Promise<any> {
    let collection = this.client.collections.get(vector.collectionName);
    if (vector.tenantName) {
      collection = collection.withTenant(vector.tenantName);
    }

    return await collection.data.deleteMany(
      collection.filter.byCreationTime().lessOrEqual(new Date()),
    );
  }

  async editVector(vector: EditVectorDto): Promise<any> {
    let collection = this.client.collections.get(vector.collectionName);
    if (vector.tenantName) {
      collection = collection.withTenant(vector.tenantName);
    }

    return await collection.data.update({
      id: vector.vectorId,
      properties: vector.properties,
      vectors: vector.vectors,
    });
  }
}
