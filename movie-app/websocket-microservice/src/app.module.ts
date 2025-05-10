import { AppController } from './../../src/app.controller';
import { Module } from '@nestjs/common';

import { AppService } from '../../src/app.service';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
