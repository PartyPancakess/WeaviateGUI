import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BackupDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  backupId?: string;

  @ApiProperty()
  collections: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  backend: 'filesystem' | 's3' | 'gcs' | 'azure' = 'filesystem';

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  enableTenants: boolean = false;
}
