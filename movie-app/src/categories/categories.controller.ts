import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.findOne(+id);
    }

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.update(+id, updateCategoryDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.remove(+id);
    }
}
