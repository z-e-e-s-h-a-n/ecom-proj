import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CUProductDto,
  GetProductsDto,
  RDProductDto,
} from "@/common/dto/product.dto";
import { slugify } from "@/lib/utils/general.util";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct({
    variants,
    attributes,
    specifications,
    slug,
    ...rest
  }: CUProductDto) {
    slug = slugify(rest.title, slug);

    const product = await this.prisma.$transaction(async (prisma) => {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });
      if (slugExists) throw new BadRequestException("Slug already exists.");

      const createdProduct = await prisma.product.create({
        data: {
          ...rest,
          slug,
          attributes: {
            create: attributes.map((attr) => attr),
          },
          specifications: {
            create: specifications.map((spec) => ({
              name: spec.name,
              value: spec.value,
            })),
          },
          variants: {
            create: variants.map((v) => ({
              sku: v.sku,
              barcode: v.barcode,
              images: v.images,
              stock: v.stock,
              inventoryStatus: v.inventoryStatus,
              isActive: v.isActive,
              isDefault: v.isDefault,
              weight: { create: v.weight },
              dimensions: { create: v.dimensions },
              pricing: { create: v.pricing },
              attributes: {
                create: v.attributes.map((a) => ({
                  name: a.name,
                  value: a.value,
                })),
              },
            })),
          },
        },
      });

      return createdProduct;
    });

    return { message: "Product created successfully", data: { product } };
  }

  async updateProduct(
    { variants, attributes, specifications, slug, ...rest }: CUProductDto,
    productId: string
  ) {
    // Fetch existing product
    const existing = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });
    if (!existing) throw new BadRequestException("Product not found.");

    slug = slugify(rest.title, slug);

    const slugExists = await this.prisma.product.findFirst({
      where: { slug, id: { not: productId } },
    });
    if (slugExists) throw new BadRequestException("Slug already exists.");

    // Start transaction
    const updatedProduct = await this.prisma.$transaction(async (prisma) => {
      // Update main product
      const product = await prisma.product.update({
        where: { id: productId },
        data: { ...rest, slug },
      });

      // Update attributes
      if (attributes) {
        await prisma.productAttribute.deleteMany({ where: { productId } });
        await prisma.productAttribute.createMany({
          data: attributes.map((attr) => ({
            productId,
            definitionId: attr.definitionId,
            options: attr.options,
          })),
        });
      }

      // Update specifications
      if (specifications) {
        await prisma.productSpecification.deleteMany({ where: { productId } });
        await prisma.productSpecification.createMany({
          data: specifications.map((spec) => ({
            productId,
            name: spec.name,
            value: spec.value,
          })),
        });
      }

      // Update variants
      if (variants) {
        // Delete old variants & nested relations
        const variantIds = existing.variants.map((v) => v.id);
        await prisma.variantAttribute.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await prisma.variantWeight.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await prisma.variantDimensions.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await prisma.productVariant.deleteMany({ where: { productId } });

        // Create new variants
        for (const v of variants) {
          await prisma.productVariant.create({
            data: {
              productId,
              sku: v.sku,
              barcode: v.barcode,
              images: v.images,
              stock: v.stock,
              inventoryStatus: v.inventoryStatus,
              isActive: v.isActive,
              isDefault: v.isDefault,
              weight: { create: v.weight },
              dimensions: { create: v.dimensions },
              pricing: { create: v.pricing },
              attributes: {
                create: v.attributes.map((a) => ({
                  name: a.name,
                  value: a.value,
                })),
              },
            },
          });
        }
      }

      return product;
    });

    return {
      message: "Product updated successfully",
      data: { product: updatedProduct },
    };
  }

  async getProduct(dto: RDProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: this.productInclude,
    });

    return { message: "Product fetched successfully.", data: { product } };
  }

  async getProducts(query: GetProductsDto) {
    const {
      page = 1,
      limit = 10,
      sort = "price_asc",
      searchQuery = "",
      categories,
      minPrice,
      maxPrice,
      ...filters
    } = query;

    const where: any = {};

    // Category filter
    if (categories?.length) {
      where.categoryId = { in: categories };
    }

    // Search filter
    if (searchQuery) {
      where.title = { contains: searchQuery, mode: "insensitive" };
    }

    // Attribute filters
    const attributeFilters = Object.entries(filters)
      .filter(([key, value]) => key.startsWith("attr_") && value)
      .map(([key, value]) => ({
        attributes: {
          some: {
            definitionId: key.replace("attr_", ""),
            options: { hasSome: Array.isArray(value) ? value : [value] },
          },
        },
      }));

    if (attributeFilters.length) {
      where.AND = attributeFilters;
    }

    // Price filter (using variants)
    if (minPrice || maxPrice) {
      where.variants = {
        some: { isDefault: true, basePrice: { gte: minPrice, lte: maxPrice } },
      };
    }

    // Sorting
    const sortOptions: Record<string, any> = {
      price_asc: { variants: { some: { basePrice: "asc" } } },
      price_desc: { variants: { some: { basePrice: "desc" } } },
      createdAt_asc: { createdAt: "asc" },
      createdAt_desc: { createdAt: "desc" },
      name_asc: { title: "asc" },
      name_desc: { title: "desc" },
    };
    const orderBy = sortOptions[sort] || { createdAt: "desc" };

    // Fetch products
    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: Number(limit),
      include: this.productInclude,
    });

    const count = await this.prisma.product.count({ where });

    return {
      message: "Products fetched successfully",
      data: {
        products,
        count,
        total: Math.ceil(count / limit),
        page,
        limit,
      },
    };
  }

  async deleteProduct(dto: RDProductDto) {
    const product = await this.prisma.product.delete({
      where: { id: dto.productId },
    });

    return { message: "Product deleted successfully.", data: { product } };
  }

  private productInclude = {
    category: true,
    attributes: true,
    specifications: true,
    reviews: true,
    variants: {
      include: { weight: true, dimensions: true, attributes: true },
    },
  };
}
