export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    address?: string;
    image?: string;
    dob?: Date;
    categories: Category[];
    ratings: Rating[];
}

export interface Category {
    id: number;
    name: string;
    movies: Movie[];
    user?: User;
    userId?: number;
}

export interface Movie {
    id: number;
    title: string;
    categoryId: number;
    category: Category;
    ratings: Rating[];
    image:string;
}


export interface Rating {
    id: number;
    value: number;
    userId: number;
    movieId: number;
    user: User;
    movie: Movie;
}
