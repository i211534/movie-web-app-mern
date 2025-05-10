import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: DatabaseService) { }

    async findAll(): Promise<Category[]> {
        return this.prisma.category.findMany();
    }

    async findOne(id: number): Promise<Category> {
        return this.prisma.category.findUnique({
            where: { id },
        });
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: number): Promise<Category> {
        return this.prisma.category.delete({
            where: { id },
        });
    }
}
