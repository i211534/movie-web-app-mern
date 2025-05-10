import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: Map<string, { socketId: string; name: string }> = new Map();
  private unseenMessages: Map<string, { fromUser: string; message: string }[]> = new Map();
  private groupMembers: Map<number, string[]> = new Map(); // GroupID to list of userIds

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    client.on('register', (data: { userId: string; name: string }) => {
      this.users.set(data.userId, { socketId: client.id, name: data.name });
      console.log(`User registered: ${data.userId} with socket ID: ${client.id}`);

      // Send unseen messages to the newly connected user
      if (this.unseenMessages.has(data.userId)) {
        const messages = this.unseenMessages.get(data.userId);
        if (messages) {
          messages.forEach((msg) => {
            this.server.to(client.id).emit('message', { user: msg.fromUser, message: msg.message, fromSelf: false });
          });
          this.unseenMessages.delete(data.userId); // Clear unseen messages after sending
        }
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, userData] of this.users.entries()) {
      if (userData.socketId === client.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { toUser: string; fromUser: string; message: string }): void {
    const targetUser = this.users.get(payload.toUser);
    const fromUser = this.users.get(payload.fromUser);
    if (targetUser && fromUser) {
      // Send message to the target user
      this.server.to(targetUser.socketId).emit('message', { user: fromUser.name, message: payload.message, fromSelf: false });

      // Notify the sender that the message was delivered
      this.server.to(fromUser.socketId).emit('messageDelivered', { toUser: payload.toUser });
    } else if (fromUser) {
      // Store unseen message if the target user is not connected
      if (!this.unseenMessages.has(payload.toUser)) {
        this.unseenMessages.set(payload.toUser, []);
      }
      this.unseenMessages.get(payload.toUser)?.push({ fromUser: fromUser.name, message: payload.message });
    } else {
      console.error(`User ${payload.toUser} is not connected`);
    }
  }

  @SubscribeMessage('groupMessage')
  handleGroupMessage(
    client: Socket,
    payload: { groupId: number; fromUser: string; message: string },
  ): void {
    const fromUser = this.users.get(payload.fromUser);
    if (fromUser && this.groupMembers.has(payload.groupId)) {
      const members = this.groupMembers.get(payload.groupId);
      if (members) {
        members.forEach((memberId) => {
          const member = this.users.get(memberId);
          if (member && member.socketId !== client.id) {
            this.server.to(member.socketId).emit('groupMessage', {
              groupId: payload.groupId,
              user: fromUser.name,
              message: payload.message,
              fromSelf: false,
            });
          }
        });

        // Notify the sender that the message was sent to the group
        this.server.to(client.id).emit('messageDelivered', { groupId: payload.groupId });
      }
    } else {
      console.error(`User ${payload.fromUser} or group ${payload.groupId} is not connected`);
    }
  }
}
