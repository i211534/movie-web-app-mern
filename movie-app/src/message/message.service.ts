// messages.service.ts
import { Injectable } from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: DatabaseService) {}

  async sendMessage(data: CreateMessageDto) {
    return this.prisma.message.create({ data });
  }

  async getMessages(senderId: number, receiverId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });
  }
}
