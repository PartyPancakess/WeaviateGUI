import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetVectorListDto {
  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty({ required: true, type: 'boolean' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeVector: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  tenantName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  filter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  searchType?: "keyword" | "nearVector" | "nearText";

  @ApiProperty({ required: false })
  @IsOptional()
  maxDistance?: number;
}
