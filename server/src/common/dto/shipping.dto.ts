import { ShipmentStatus, ShippingMethod } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CUShippingRateDto {
  @IsNotEmpty()
  @IsString()
  provider!: string;

  @IsNotEmpty()
  @IsString()
  service!: string;

  @IsEnum(ShippingMethod)
  method!: ShippingMethod;

  @IsOptional()
  @IsString()
  originCity?: string;

  @IsNotEmpty()
  @IsString()
  destinationCity!: string;

  @IsNotEmpty()
  @IsDecimal()
  minWeight!: number;

  @IsNotEmpty()
  @IsDecimal()
  maxWeight!: number;

  @IsNotEmpty()
  @IsDecimal()
  minVolume!: number;

  @IsNotEmpty()
  @IsDecimal()
  maxVolume!: number;

  @IsNotEmpty()
  @IsDecimal()
  baseRate!: number;

  @IsNotEmpty()
  @IsDecimal()
  perKgRate!: number;

  @IsNotEmpty()
  @IsString()
  deliveryTime!: string;

  @IsNotEmpty()
  @IsString()
  currencyId!: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDefault?: boolean;
}

export class RDShippingRateDto {
  @IsNotEmpty()
  @IsString()
  shippingRateId!: string;
}

export class CUShipmentDto {
  @IsNotEmpty()
  @IsString()
  provider!: string;

  @IsNotEmpty()
  @IsString()
  service!: string;

  @IsEnum(ShippingMethod)
  method!: ShippingMethod;

  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsNotEmpty()
  @IsString()
  rateId!: string;

  @IsNotEmpty()
  @IsString()
  trackingNumber!: string;

  @IsNotEmpty()
  @IsString()
  trackingUrl!: string;

  @IsNotEmpty()
  @IsString()
  labelUrl!: string;

  @IsOptional()
  @IsJSON()
  metadata?: string;

  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;
}

export class RDShipmentDto {
  @IsNotEmpty()
  @IsString()
  shipmentId!: string;
}
