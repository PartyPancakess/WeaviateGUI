import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilterGroupModel } from '../model/filter.model';

export class GetVectorCountDto {
  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  filter?: string;
}
