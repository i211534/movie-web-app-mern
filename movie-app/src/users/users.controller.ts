import { diskStorage } from 'multer';
import { Body, Controller, Param, ParseIntPipe, Post, Put, BadRequestException } from '@nestjs/common';
import { RateMovieDto } from './dto/rate-movie.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersService } from './users.service';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';


import { UploadedFile } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Put(':id/profile')
    async updateUserProfile(
        @Param('id', ParseIntPipe) userId: number,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
    ) {
        return this.usersService.updateUserProfile(userId, updateUserProfileDto);
    }

    @Post(':id/rate-movie')
    async rateMovie(
        @Param('id', ParseIntPipe) userId: number,
        @Body() rateMovieDto: RateMovieDto,
    ) {
        return this.usersService.rateMovie(userId, rateMovieDto);
    }

    
  }
  

