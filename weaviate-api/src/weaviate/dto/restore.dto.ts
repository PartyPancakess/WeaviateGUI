import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RestoreDto {
  @ApiProperty()
  @IsString()
  backupId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  backend: 'filesystem' | 's3' | 'gcs' | 'azure' = 'filesystem';
}
