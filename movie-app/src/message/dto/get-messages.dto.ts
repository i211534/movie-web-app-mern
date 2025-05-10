// get-messages.dto.ts
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMessagesDto {
  @Type(() => Number)
  @IsInt()
  senderId: number;

  @Type(() => Number)
  @IsInt()
  receiverId: number;
}
