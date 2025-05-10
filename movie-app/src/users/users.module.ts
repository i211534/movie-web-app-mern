import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, DatabaseService],
})
export class UsersModule { }
