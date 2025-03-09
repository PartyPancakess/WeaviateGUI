import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteVectorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tenantName?: string;

  @ApiProperty()
  vectorIds?: string[];
}
