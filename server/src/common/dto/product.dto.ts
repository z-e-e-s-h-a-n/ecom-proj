import {
  DimensionUnit,
  InventoryStatus,
  ProductStatus,
  WeightUnit,
} from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

// ---------------------------
// Nested DTOs
// ---------------------------

export class ProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  definitionId!: string;

  @IsArray()
  @IsString({ each: true })
  options!: string[];
}

export class VariantAttributeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class ProductSpecificationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class VariantWeightDto {
  @IsNumber()
  @IsNotEmpty()
  value!: number;

  @IsEnum(WeightUnit)
  @IsNotEmpty()
  unit!: WeightUnit;
}

export class VariantDimensionsDto {
  @IsNumber()
  @IsNotEmpty()
  length!: number;

  @IsNumber()
  @IsNotEmpty()
  width!: number;

  @IsNumber()
  @IsNotEmpty()
  height!: number;

  @IsEnum(DimensionUnit)
  @IsNotEmpty()
  unit!: DimensionUnit;
}

export class VariantPricingDto {
  @IsString()
  @IsNotEmpty()
  currencyId!: string;

  @IsNumber()
  @IsNotEmpty()
  basePrice!: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsNumber()
  @IsNotEmpty()
  costPrice!: number;
}

// ---------------------------
// Product Variant DTO
// ---------------------------

export class ProductVariantDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNumber()
  @IsNotEmpty()
  stock!: number;

  @IsOptional()
  @IsEnum(InventoryStatus)
  inventoryStatus?: InventoryStatus;

  @ValidateNested()
  @Type(() => VariantWeightDto)
  weight!: VariantWeightDto;

  @ValidateNested()
  @Type(() => VariantDimensionsDto)
  dimensions!: VariantDimensionsDto;

  @IsArray()
  @ValidateNested()
  @Type(() => VariantPricingDto)
  pricing!: VariantPricingDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeDto)
  attributes!: VariantAttributeDto[];
}

// ---------------------------
// Create, Update Product DTO
// ---------------------------

export class CUProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status!: ProductStatus;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants!: ProductVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes!: ProductAttributeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  specifications!: ProductSpecificationDto[];
}

// ---------------------------
// Read, Query DTOs
// ---------------------------

export class RDProductDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;
}

export class GetProductsDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
