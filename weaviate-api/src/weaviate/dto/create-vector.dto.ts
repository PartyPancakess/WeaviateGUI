import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVector {
  @ApiProperty()
  properties: { [key: string]: any };

  @ApiProperty()
  @IsString()
  @IsOptional()
  customId?: string;

  @ApiProperty()
  @IsOptional()
  vectors?: number[] | { [key: string]: number[] };

  // TODO: Add references
}

export class CreateVectorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tenantName?: string;

  @ApiProperty()
  data: CreateVector;
}
