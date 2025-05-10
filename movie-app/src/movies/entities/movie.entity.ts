import { Category } from "src/categories/entities/category.entity";


export class Movie {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    ratings: number[];

    constructor(id: number, title: string, description: string, categoryId: number) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.categoryId = categoryId;
        this.ratings = [];
    }

    addRating(rating: number) {
        this.ratings.push(rating);
    }

    get averageRating(): number {
        if (this.ratings.length === 0) return 0;
        return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
    }
}
