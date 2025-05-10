// messages.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MessagesService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.sendMessage(createMessageDto);
  }

  @Get()
  async getMessages(@Query() getMessagesDto: GetMessagesDto) {
    const { senderId, receiverId } = getMessagesDto;
    return this.messagesService.getMessages(senderId, receiverId);
  }
}
