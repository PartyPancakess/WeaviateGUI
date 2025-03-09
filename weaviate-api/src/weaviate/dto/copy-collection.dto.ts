import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CopyCollectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceCollection: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetCollection: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  disableTenants: boolean = false;
}
