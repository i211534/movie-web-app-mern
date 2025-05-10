import { GroupMessage, User } from '@prisma/client';

export class ChatGroupDto {
    id: number;
    name: string;
    description?: string;
    members: User[];       // Array of members
    messages: GroupMessage[];  // Array of messages
}
