import { Injectable } from '@nestjs/common';
import { Prisma, Movie } from '@prisma/client';
import { DatabaseService } from '../../../src/database/database.service';

@Injectable()
export class RecommendationsService {
  constructor(private Prisma: DatabaseService) {}

  async getRecommendations(userId: string): Promise<Movie[]> {
    // Fetch movies based on user ratings
    const recommendedMovies = await this.Prisma.movie.findMany({
      where: {
        categoryId: {
          in: await this.getTopRatedCategories(userId), // Fetch top rated categories by the user
        },
      },
      take: 10, // Limit to a reasonable number of movies
    });

    return recommendedMovies;
  }

  private async getTopRatedCategories(userId: string): Promise<number[]> {
   // console.log('In recommendation');
    // Find the categories where the user has given high ratings (e.g., 5 stars)
    const topRatedCategories = await this.Prisma.rating.findMany({
      where: {
        userId: parseInt(userId, 10),
        value: 5, // Assuming 5 is the highest rating
      },
      select: {
        movie: {
          select: {
            categoryId: true,
          },
        },
      },
    });

    const categoryIds = topRatedCategories.map(rating => rating.movie.categoryId);
  //  console.log('Recommendation Service:', categoryIds);
    return categoryIds;
  }
}
