import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RateMovieDto } from './dto/rate-movie.dto'; 
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository, private readonly prisma: DatabaseService) { }

    async updateUserProfile(userId: number, updateUserProfileDto: UpdateUserProfileDto) {

        return this.usersRepository.updateUserProfile(userId, updateUserProfileDto);
    }

    async rateMovie(userId: number, rateMovieDto: RateMovieDto) {

        return this.usersRepository.rateMovie(userId, rateMovieDto);
    }
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
   
}
