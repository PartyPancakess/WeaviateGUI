import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteCollectionDto {
  @ApiProperty()
  @IsString()
  name: string;
}
