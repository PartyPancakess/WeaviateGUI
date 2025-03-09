import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteTenantDto {
  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty()
  @IsString()
  tenantName: string;
}
