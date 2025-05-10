import { IsString, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsArray()
  @ArrayNotEmpty()
  memberIds: number[];
}
