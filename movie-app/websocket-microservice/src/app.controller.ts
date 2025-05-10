import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './app.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('register')
  async registerUser(@Body() registerDto: { userId: string, name: string }) {
    return this.chatService.registerUser(registerDto.userId, registerDto.name);
  }

  @Post('message')
  async sendMessage(@Body() messageDto: { toUser: string, fromUser: string, message: string }) {
    return this.chatService.sendMessage(messageDto.toUser, messageDto.fromUser, messageDto.message);
  }
}
