import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty()
  config: any;
}
