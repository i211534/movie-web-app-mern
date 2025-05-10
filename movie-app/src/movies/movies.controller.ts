import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards, Logger, ParseIntPipe, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateMovieDto, RateMovieDto, UpdateMovieDto } from './dto/movie.dto';
import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(
    private readonly moviesService: MoviesService,
  ) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Get('category/:id')
  async getMoviesByCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.moviesService.getMoviesByCategory(categoryId);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Patch('rate')
  rateMovie(@Body() rateMovieDto: RateMovieDto) {
    return this.moviesService.rateMovie(rateMovieDto);
  }

  @Get(':movieId/rating')
  async getMovieRating(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.moviesService.getMovieRating(movieId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('recommend/:userId')
  async recommendMovies(@Param('userId', ParseIntPipe) userId: number, @Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    this.logger.log(`Requesting recommendations for user ID: ${userId} with token: ${token}`);
    const recommendations = await this.moviesService.recommendMovies(userId, token);
    console.log(recommendations);
    return recommendations;
  }


}