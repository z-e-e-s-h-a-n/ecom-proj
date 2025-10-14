import { OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  sku!: string;

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

export class CreateOrderDto {
  @IsDecimal()
  @IsNotEmpty()
  subtotal!: number;

  @IsDecimal()
  @IsNotEmpty()
  taxAmount!: number;

  @IsDecimal()
  @IsNotEmpty()
  shippingAmount!: number;

  @IsDecimal()
  @IsNotEmpty()
  discountAmount!: number;

  @IsDecimal()
  @IsNotEmpty()
  total!: number;

  @IsString()
  @IsNotEmpty()
  currencyId!: string;

  @IsString()
  @IsNotEmpty()
  shippingAddressId!: string;

  @IsOptional()
  @IsString()
  billingAddressId!: string;

  @IsString()
  @IsNotEmpty()
  taxRateId!: string;

  @IsOptional()
  @IsString()
  customerNotes!: string;

  @IsOptional()
  @IsString()
  internalNotes!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  customerNotes?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;
}

export class RDOrderDto {
  orderId!: string;
}
