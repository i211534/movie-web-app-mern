import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { DatabaseService } from '../database/database.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChatGroupDto } from './dto/chat-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { imagedto } from './dto/imagedto.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Oneuserdto } from './dto/oneuser.dto';
import { SimpleUserDto } from './dto/simple-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { password: changePasswordDto.newPassword },
    });
    return user;
  }

  async findById(id: number, oneuserdto: Oneuserdto): Promise<User | null> {
    await this.prisma.user.update({
      where: { id: id },
      data: {
        name: oneuserdto.name,
        email: oneuserdto.email,
        image: oneuserdto.image,
        dob: oneuserdto.dob,
        address: oneuserdto.address,
      },
    });
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async signup(createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,

        password: createUserDto.password,
      },
    });
    const payload = { email: user.email, sub: user.id.toString() }; // Ensure user ID is a string
    const access_token = this.jwtService.sign(payload);

    // Create a session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: access_token,
      },
    });

    return { access_token };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
        password: loginUserDto.password,
      },
    });
    if (user) {
      const payload = { sub: user.id.toString(), email: user.email }; // Ensure user ID is a string
      const access_token = this.jwtService.sign(payload);

      // Create a session
      await this.prisma.session.create({
        data: {
          userId: user.id,
          token: access_token,
        },
      });

      return { access_token };
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async getLoggedInUsers(): Promise<SimpleUserDto[]> {
    const sessions = await this.prisma.session.findMany({
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map the sessions to SimpleUserDto
    return sessions.map(session => ({
      id: session.user.id,
      name: session.user.name,
    }));
  }


  async showAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async updateUserProfilePicture(userId: number, imagedto: imagedto): Promise<User> {
    console.log("UserID for file upload: ", userId);
    console.log("Filepath (updateUserProfilePicture): ", imagedto.image);
    return this.prisma.user.update({
      where: { id: userId },
      data: { image: imagedto.image },
    });
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<any> {
    const { groupName, memberIds } = createGroupDto;

    // Create the group
    const group = await this.prisma.chatGroup.create({
      data: {
        name: groupName,
        members: {
          connect: memberIds.map(id => ({ id })),
        },
      },
      include: {
        members: true,
      },
    });

    return group;
  }

  async getChatGroups(): Promise<ChatGroupDto[]> {
    const chatGroups = await this.prisma.chatGroup.findMany({
      include: {
        members: true,  // Include members of each chat group
        messages: true, // Include messages in each group
      },
    });

    // Map the retrieved data to ChatGroupDto
    return chatGroups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members,
      messages: group.messages,
    }));
  }
}
