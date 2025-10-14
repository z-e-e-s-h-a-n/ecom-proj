import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { RDCategoryDto, CUCategoryDto } from "@/common/dto/category.dto";
import { slugify } from "@/lib/utils/general.util";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory({ slug, ...rest }: CUCategoryDto) {
    slug = slugify(rest.title, slug);

    const slugExists = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (slugExists) throw new BadRequestException("Slug already exists.");

    const category = await this.prisma.category.create({
      data: { ...rest, slug },
    });

    return { message: "Categories created successfully", data: { category } };
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      includeDeleted: true,
    });

    return {
      message: "Categories fetched successfully.",
      data: { categories },
    };
  }

  async getCategory(dto: RDCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    return { message: "Category fetched successfully.", data: { category } };
  }

  async updateCategory(dto: CUCategoryDto, categoryId: string) {
    const category = await this.prisma.category.update({
      where: { id: categoryId },
      data: dto,
    });

    return { message: "Category updated successfully.", data: { category } };
  }

  async deleteCategory(dto: RDCategoryDto) {
    const category = await this.prisma.category.delete({
      where: { id: dto.categoryId },
    });

    return { message: "Category deleted successfully.", data: { category } };
  }
}
