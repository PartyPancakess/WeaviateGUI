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

    const options = {
      limit: dto.limit || undefined,
      offset: dto.offset || undefined,
      includeVector: dto.includeVector,
      distance: dto.maxDistance,
      returnMetadata: ['creationTime', 'updateTime', 'score'],
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
          list = await collection.query.bm25(
            dto.query as string,
            options as any,
          );
        } else if (dto.searchType === 'nearVector') {
          options.returnMetadata.push('distance');
          list = await collection.query.nearVector(
            JSON.parse(dto.query) as number[],
            options as any,
          );
        } else if (dto.searchType === 'nearText') {
          options.returnMetadata.push('distance');
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

    return await collection.data.insert({
      id: vector.data.customId,
      properties: vector.data.properties,
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
    })
    
  }
}
