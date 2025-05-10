import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RecommendationsModule } from 'recommendations-service/recommendations-service/src/app.module';
import { RecommendationsService } from 'recommendations-service/recommendations-service/src/app.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from 'websocket-microservice/src/app.controller';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';

import { ChatService } from 'websocket-microservice/src/app.service';
import { HttpModule } from '@nestjs/axios';
import { ChatGateway } from 'websocket-microservice/src/chat.gateway';
import { MessagesController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { MessagesService } from './message/message.service';


@Module({
  imports: [
    HttpModule,
    AuthModule, 
    RecommendationsModule, 
    JwtModule.register({
      secret: "my_super_secret_key_12345!",
      signOptions: { expiresIn: '60m' },
    }), 
    DatabaseModule, 
    CategoriesModule, 
    MoviesModule, 
    UsersModule, 
    ClientsModule.register([
      {
        name: 'RECOMMENDATIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8877,
        },
      },
    ]), 
    ConfigModule.forRoot({
      isGlobal: true,
    }), MessageModule
  ],
  controllers: [AppController,ChatController, MessagesController],
  providers: [AppService, RecommendationsService,ChatGateway, DatabaseService, ChatService, MessagesService], // Add ChatGateway here
})
export class AppModule { }
