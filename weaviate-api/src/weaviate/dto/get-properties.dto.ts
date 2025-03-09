import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPropertiesDto {
  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantName?: string;
}
