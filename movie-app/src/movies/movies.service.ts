import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { CreateMovieDto, RateMovieDto, UpdateMovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  private client: ClientProxy;

  constructor(private prisma: DatabaseService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    });
  }

  async getMoviesByCategory(categoryId: number) {
    return this.prisma.movie.findMany({
      where: { categoryId: Number(categoryId) },
    });
  }

  async create(createMovieDto: CreateMovieDto) {
    const { title, categoryId } = createMovieDto;
    return this.prisma.movie.create({
      data: {
        categoryId,
        title,
      },
    });
  }

  async findAll() {
    return this.prisma.movie.findMany();
  }

  async findOne(id: number) {
    return this.prisma.movie.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }



  async rateMovie(rateMovieDto: RateMovieDto) {
    const { movieId, rating, userId } = rateMovieDto;
    await this.prisma.rating.create({
      data: {
        value: rating,
        movieId,
        userId,
      },
    });
    return this.findOne(movieId);
  }

  async recommendMovies(userId: number, jwtToken: string) {
    try {
      const recommendations = await firstValueFrom(
        this.client.send(
          { cmd: 'get-recommendations' },
          { userId: userId.toString(), jwtToken } // Ensure the token is included in the payload
        )
      );

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async getMovieRating(movieId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { movieId },
      select: { value: true },
    });

    const count = ratings.length;
    const avgRating = count
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / count
      : 0;

    return { avgRating, count };
  }
}
