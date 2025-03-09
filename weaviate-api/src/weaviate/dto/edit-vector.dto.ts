import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditVectorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tenantName?: string;

  @ApiProperty()
  @IsString()
  vectorId: string;

  @ApiProperty()
  @IsOptional()
  properties?: { [key: string]: any };

  @ApiProperty()
  @IsOptional()
  vectors?: number[] | { [key: string]: number[] };
}
