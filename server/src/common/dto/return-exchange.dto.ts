import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import {
  ReturnExchangeStatus,
  ReturnExchangeType,
  ReturnShippingResponsibility,
} from "@prisma/client";

export class ReturnExchangeItemDto {
  @IsNotEmpty()
  @IsString()
  orderItemId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity!: number;
}

export class ReturnExchangeVariantDto {
  @IsNotEmpty()
  @IsString()
  variantId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity!: number;
}

export class CreateReturnExchangeDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsEnum(ReturnExchangeType)
  type!: ReturnExchangeType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(ReturnShippingResponsibility)
  shippingResponsibility?: ReturnShippingResponsibility;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceDifference?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReturnExchangeItemDto)
  orderItems?: ReturnExchangeItemDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReturnExchangeVariantDto)
  exchangeVariants?: ReturnExchangeVariantDto[];
}

export class RDReturnExchangeDto {
  @IsNotEmpty()
  @IsString()
  returnExchangeId!: string;
}

export class UpdateReturnExchangeDto {
  @IsEnum(ReturnExchangeStatus)
  status!: ReturnExchangeStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
