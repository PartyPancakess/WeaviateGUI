import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty()
  @IsIn(['HOT', 'COLD', 'FROZEN'])
  @IsOptional()
  status: 'HOT' | 'COLD' | 'FROZEN' = 'COLD';
}
