import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  GetAttributesDto,
  RDAttributeDto,
  CUAttributeDto,
} from "@/common/dto/attribute.dto";

@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttribute({ categories, ...rest }: CUAttributeDto) {
    const attribute = await this.prisma.attributeDefinition.create({
      data: {
        ...rest,
        categories: {
          connect: categories.map((id) => ({ id })),
        },
      },
    });

    return { message: "Attribute created successfully", data: { attribute } };
  }

  async getAttributes(dto: GetAttributesDto) {
    const attributes = await this.prisma.attributeDefinition.findMany({
      where: dto.categories
        ? { categories: { some: { id: { in: dto.categories } } } }
        : undefined,
    });

    return {
      message: "Attributes fetched successfully.",
      data: { attributes },
    };
  }

  async getAttribute(dto: RDAttributeDto) {
    const attribute = await this.prisma.attributeDefinition.findUnique({
      where: { id: dto.attrId },
    });

    return { message: "Attribute fetched successfully.", data: { attribute } };
  }

  async updateAttribute(
    { categories, ...rest }: CUAttributeDto,
    attrId: string
  ) {
    const attribute = await this.prisma.attributeDefinition.update({
      where: { id: attrId },
      data: {
        ...rest,
        categories: {
          set: categories.map((id) => ({ id })),
        },
      },
    });

    return { message: "Attribute updated successfully", data: { attribute } };
  }

  async deleteAttribute(dto: RDAttributeDto) {
    const attribute = await this.prisma.attributeDefinition.delete({
      where: { id: dto.attrId },
    });

    return { message: "Attribute deleted successfully.", data: { attribute } };
  }
}
