import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CloneCollectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cloneName: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  disableTenants: boolean = false;
}
