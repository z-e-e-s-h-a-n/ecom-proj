import { Public } from "@/decorators/public.decorator";
import { CategoryService } from "./category.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type { RDCategoryDto, CUCategoryDto } from "@/common/dto/category.dto";
import { Roles } from "@/common/decorators/roles.decorator";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Roles("admin")
  @Post()
  async createCategory(@Body() dto: CUCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Public()
  @Get("/:categoryId")
  async getCategory(@Param() dto: RDCategoryDto) {
    return this.categoryService.getCategory(dto);
  }

  @Roles("admin")
  @Put("/:categoryId")
  async updateCategory(
    @Param("categoryId") categoryId: string,
    @Body() dto: CUCategoryDto
  ) {
    return this.categoryService.updateCategory(dto, categoryId);
  }

  @Roles("admin")
  @Delete("/:categoryId")
  async deleteCategory(@Param() dto: RDCategoryDto) {
    return this.categoryService.deleteCategory(dto);
  }
}
