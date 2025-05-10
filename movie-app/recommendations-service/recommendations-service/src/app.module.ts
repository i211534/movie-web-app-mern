import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../../src/auth/auth.module';
import { DatabaseService } from '../../../src/database/database.service';
import { RecommendationsController } from './app.controller';
import { RecommendationsService } from './app.service';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  JwtModule.register({
    secret: "my_super_secret_key_12345!",
    signOptions: { expiresIn: '60m' },
  }),
    AuthModule,],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, DatabaseService],
})
export class RecommendationsModule { }
