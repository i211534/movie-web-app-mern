import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, DatabaseService]
})
export class CategoriesModule { }
