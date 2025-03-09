import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  Sse,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCollectionCommand } from './command/create-collection.command';
import { GetCollectionListQuery } from './query/get-collection-list.query';
import { GetCollectionInfoQuery } from './query/get-collection-info.query';
import { DeleteCollectionDto } from './dto/delete-collection.dto';
import { DeleteCollectionCommand } from './command/delete-collection.command';
import { GetDBInfoQuery } from './query/get-db-info.query';
import { GetTenantListQuery } from './query/get-tenant-list.query';
import { CreateTenantCommand } from './command/create-tenant.command';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { DeleteTenantDto } from './dto/delete-tenant.dto';
import { DeleteTenantCommand } from './command/delete-tenant.command';
import { UpdateTenantCommand } from './command/update-tenant.command';
import { GetTenantQuery } from './query/get-tenant.query';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { GetVectorListQuery } from './query/get-vector-list.query';
import { CreateVectorDto } from './dto/create-vector.dto';
import { CreateVectorCommand } from './command/create-vector.command';
import { GetVectorCountQuery } from './query/get-vector-count.query';
import { GetVectorListDto } from './dto/get-vector-list.dto';
import { GetVectorCountDto } from './dto/get-vector-count.dto';
import { DeleteVectorDto } from './dto/delete-vector.dto';
import { DeleteVectorCommand } from './command/delete-vector.command';
import { DeleteVectorsCommand } from './command/delete-vectors.command';
import { GetPropertiesDto } from './dto/get-properties.dto';
import { GetPropertiesQuery } from './query/get-properties.query';
import { EditVectorDto } from './dto/edit-vector.dto';
import { UpdateVectorCommand } from './command/update-vector.command';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateCollectionCommand } from './command/update-collection.command';
import { GetCollectionJSONQuery } from './query/get-collection-json.query';
import { CloneCollectionDto } from './dto/clone-collection.dto';
import { CloneCollectionCommand } from './command/clone-collection.command';
import { Observable } from 'rxjs';
import { GetMigrationStatusQuery } from './query/get-migration-status.query';
import { CloneTenantDto } from './dto/clone-tenant.dto';
import { CloneTenantCommand } from './command/clone-tenant.command';
import { CopyCollectionDto } from './dto/copy-collection.dto';
import { CopyCollectionCommand } from './command/copy-collection.command';
import { CopyTenantDto } from './dto/copy-tenant.dto';
import { CopyTenantCommand } from './command/copy-tenant.command';
import { BackupDto } from './dto/backup.dto';
import { BackupCommand } from './command/backup.command';
import { RestoreDto } from './dto/restore.dto';
import { RestoreCommand } from './command/restore.command';

@Controller('weaviate')
export class WeaviateController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/db-info')
  async getDBInfo() {
    return await this.queryBus.execute(new GetDBInfoQuery());
  }

  @Get('/collection-list')
  async getCollectionList() {
    return await this.queryBus.execute(new GetCollectionListQuery());
  }

  @Get('/collection/:name')
  async getCollectionInfo(@Param('name') name: string) {
    return await this.queryBus.execute(new GetCollectionInfoQuery(name));
  }

  @Post('/collection')
  async createCollection(@Body() dto: CreateCollectionDto) {
    return await this.commandBus.execute(new CreateCollectionCommand(dto));
  }

  @Get('/collection-json/:name')
  async getCollectionJSON(@Param('name') name: string) {
    return await this.queryBus.execute(new GetCollectionJSONQuery(name));
  }

  @Patch('/collection')
  async updateCollection(@Body() dto: UpdateCollectionDto) {
    return await this.commandBus.execute(new UpdateCollectionCommand(dto));
  }

  @Delete('/collection')
  async deleteCollection(@Body() dto: DeleteCollectionDto) {
    return await this.commandBus.execute(new DeleteCollectionCommand(dto));
  }

  @Get('/collection/:collectionName/tenant-list')
  async getTenantList(@Param('collectionName') collectionName: string) {
    return await this.queryBus.execute(new GetTenantListQuery(collectionName));
  }

  @Get('/collection/:collectionName/tenant/:tenantname')
  async getTenantByName(
    @Param('collectionName') collectionName: string,
    @Param('tenantname') tenantname: string,
  ) {
    return await this.queryBus.execute(
      new GetTenantQuery(collectionName, tenantname),
    );
  }

  @Post('/collection/tenant')
  async addTenant(@Body() dto: CreateTenantDto) {
    return await this.commandBus.execute(new CreateTenantCommand(dto));
  }

  @Delete('/collection/tenant')
  async deleteTenant(@Body() dto: DeleteTenantDto) {
    return await this.commandBus.execute(new DeleteTenantCommand(dto));
  }

  @Patch('/collection/tenant')
  async updateTenant(@Body() dto: CreateTenantDto) {
    return await this.commandBus.execute(new UpdateTenantCommand(dto));
  }

  @Get('/properties')
  async getProperties(@Query() dto: GetPropertiesDto) {
    return await this.queryBus.execute(new GetPropertiesQuery(dto));
  }

  @Get('/vector-count')
  async getVectorCount(@Query() dto: GetVectorCountDto) {
    return await this.queryBus.execute(new GetVectorCountQuery(dto));
  }

  @Get('/vectors')
  async getVectors(@Query() dto: GetVectorListDto) {
    return await this.queryBus.execute(new GetVectorListQuery(dto));
  }

  @Post('/vector')
  async addVector(@Body() dto: CreateVectorDto) {
    return await this.commandBus.execute(new CreateVectorCommand(dto));
  }

  @Patch('/vector')
  async editVector(@Body() dto: EditVectorDto) {
    return await this.commandBus.execute(new UpdateVectorCommand(dto));
  }

  @Delete('/vector')
  async deleteVector(@Body() dto: DeleteVectorDto) {
    return await this.commandBus.execute(new DeleteVectorCommand(dto));
  }

  @Delete('/vectors')
  async deleteVectors(@Body() dto: DeleteVectorDto) {
    return await this.commandBus.execute(new DeleteVectorsCommand(dto));
  }

  // Migrations

  @Sse('/migration/status')
  async cloneCollectionGetStatus(
    @Query('processId') processId: string,
  ): Promise<Observable<MessageEvent>> {
    return await this.queryBus.execute(new GetMigrationStatusQuery(processId));
  }

  @Post('/migration/clone-collection-start')
  async cloneCollectionStartProcess(
    @Body() dto: CloneCollectionDto,
  ): Promise<string> {
    return await this.commandBus.execute(new CloneCollectionCommand(dto));
  }

  @Post('/migration/clone-tenant-start')
  async cloneTenantStartProcess(@Body() dto: CloneTenantDto): Promise<string> {
    return await this.commandBus.execute(new CloneTenantCommand(dto));
  }

  @Post('/migration/copy-collection-start')
  async copyCollectionStartProcess(
    @Body() dto: CopyCollectionDto,
  ): Promise<string> {
    return await this.commandBus.execute(new CopyCollectionCommand(dto));
  }

  @Post('/migration/copy-tenant-start')
  async copyTenantStartProcess(@Body() dto: CopyTenantDto): Promise<string> {
    return await this.commandBus.execute(new CopyTenantCommand(dto));
  }

  @Post('/migration/backup')
  async backupStartProcess(@Body() dto: BackupDto): Promise<string> {
    return await this.commandBus.execute(new BackupCommand(dto));
  }

  @Post('/migration/restore')
  async restoreStartProcess(@Body() dto: RestoreDto): Promise<string> {
    return await this.commandBus.execute(new RestoreCommand(dto));
  }
}
