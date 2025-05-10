import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RateMovieDto } from './dto/rate-movie.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: DatabaseService) { }

    async updateUserProfile(userId: number, updateUserProfileDto: UpdateUserProfileDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...updateUserProfileDto,
            },
        });
    }

    async rateMovie(userId: number, rateMovieDto: RateMovieDto) {

        const existingRating = await this.prisma.rating.findFirst({
            where: {
                userId: userId,
                movieId: rateMovieDto.movieId,
            },
        });

        if (existingRating) {

            return this.prisma.rating.update({
                where: { id: existingRating.id },
                data: { value: rateMovieDto.rating },
            });
        } else {

            return this.prisma.rating.create({
                data: {
                    value: rateMovieDto.rating,
                    user: { connect: { id: userId } },
                    movie: { connect: { id: rateMovieDto.movieId } },
                },
            });
        }
    }
}
