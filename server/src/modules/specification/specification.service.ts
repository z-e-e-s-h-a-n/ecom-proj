import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CUSpecificationDto,
  GetSpecificationsDto,
  RDSpecificationDto,
} from "@/common/dto/specifications.dto";

@Injectable()
export class SpecificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createSpecification({ categories, ...rest }: CUSpecificationDto) {
    const specification = await this.prisma.specificationDefinition.create({
      data: {
        ...rest,
        categories: {
          connect: categories.map((id) => ({ id })),
        },
      },
    });

    return {
      message: "Specification created successfully",
      data: { specification },
    };
  }

  async getSpecifications(dto: GetSpecificationsDto) {
    const specifications = await this.prisma.specificationDefinition.findMany({
      where: dto.categories
        ? { categories: { some: { id: { in: dto.categories } } } }
        : undefined,
    });

    return {
      message: "Specification Definitions fetched successfully.",
      data: { specifications },
    };
  }

  async getSpecification(dto: RDSpecificationDto) {
    const specification = await this.prisma.specificationDefinition.findUnique({
      where: { id: dto.specsId },
    });

    return {
      message: "Specification Definition fetched successfully.",
      data: { specification },
    };
  }

  async updateSpecification(
    { categories, ...rest }: CUSpecificationDto,
    specsId: string
  ) {
    const specification = await this.prisma.specificationDefinition.update({
      where: { id: specsId },
      data: {
        ...rest,
        categories: {
          set: categories.map((id) => ({ id })),
        },
      },
    });

    return {
      message: "Specification updated successfully",
      data: { specification },
    };
  }

  async deleteSpecification(dto: RDSpecificationDto) {
    const specification = await this.prisma.specificationDefinition.delete({
      where: { id: dto.specsId },
    });

    return {
      message: "Specification Definition deleted successfully.",
      data: { specification },
    };
  }
}
