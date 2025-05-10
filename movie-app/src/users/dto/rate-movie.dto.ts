import { IsInt, Max, Min } from 'class-validator';

export class RateMovieDto {
  @IsInt()
  movieId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
