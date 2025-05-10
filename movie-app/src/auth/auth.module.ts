import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule, UsersModule, PassportModule, JwtModule.register({
    secret: 'my_super_secret_key_12345!',
    signOptions: { expiresIn: '60m' }
  })],
  providers: [AuthService, JwtStrategy, DatabaseService, UsersService, UsersRepository],
  exports: [AuthService]
})
export class AuthModule { }
