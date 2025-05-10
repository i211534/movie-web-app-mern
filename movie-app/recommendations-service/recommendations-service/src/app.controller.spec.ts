import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './app.controller';
import { RecommendationsService } from './app.service';

describe('RecommendationsController', () => {
  let appController: RecommendationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [RecommendationsService],
    }).compile();

    appController = app.get<RecommendationsController>(RecommendationsController);
  });


});

