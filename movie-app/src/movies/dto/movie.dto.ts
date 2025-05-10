export class CreateMovieDto {
    title: string;
    image?:string;
    categoryId: number;
    description? : string;
}

export class UpdateMovieDto {
    title?: string;
    image? :string;
    categoryId?: number;
    description? : string;
}

export class RateMovieDto {
    movieId: number;
    rating: number;
    userId: number;
}
