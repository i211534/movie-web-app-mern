import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ChatService {
  constructor(private readonly httpService: HttpService) {}

  async registerUser(userId: string, name: string) {
    return this.httpService.post('http://websocket-microservice:3001/register', { userId, name }).toPromise();
  }

  async sendMessage(toUser: string, fromUser: string, message: string) {
    return this.httpService.post('http://websocket-microservice:3001/message', { toUser, fromUser, message }).toPromise();
  }
}
