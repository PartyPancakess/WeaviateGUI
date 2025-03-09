import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CopyTenantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceCollection: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetCollection: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceTenant: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetTenant: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  disableTenants: boolean = false;
}
