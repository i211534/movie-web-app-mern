import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('uploads/profile-pictures/:imageName')
  async serveImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = `./uploads/profile-pictures/${imageName}`;
    res.sendFile(imagePath, { root: '.' });
  }
}
