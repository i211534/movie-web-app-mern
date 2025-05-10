import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database/database.service';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
@Module({
  imports: [ClientsModule.register([
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
  }),
  JwtModule.register({
    secret: "my_super_secret_key_12345!",
    signOptions: { expiresIn: '60m' },
  }),
    AuthModule
  ],

  controllers: [MoviesController],
  providers: [MoviesService, DatabaseService],
})
export class MoviesModule { }
