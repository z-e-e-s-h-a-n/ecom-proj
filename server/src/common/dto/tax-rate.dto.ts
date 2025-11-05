import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CUTaxRateDto {
  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsDecimal()
  @Type(() => Number)
  rate!: number;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  appliesToShipping?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categories!: string[];
}

export class CartItemDto {
  @IsNotEmpty()
  @IsString()
  categoryId!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  @IsDecimal()
  @IsNotEmpty()
  unitPrice!: number;

  @IsDecimal()
  @IsNotEmpty()
  totalPrice!: number;
}

export class RDTaxRateDto {
  @IsNotEmpty()
  @IsString()
  taxRateId!: string;
}

export class CalculateTaxDto {
  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsNotEmpty()
  @IsString()
  region!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];

  @IsNotEmpty()
  @IsDecimal()
  shippingAmount!: number;
}
