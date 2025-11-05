import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { CouponType } from "@prisma/client";

export class CUCouponDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(CouponType)
  type!: CouponType;

  @IsNotEmpty()
  @IsDecimal()
  @Type(() => Number)
  value!: number;

  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate!: Date;

  @IsOptional()
  @IsInt()
  usageLimit!: number;

  @IsOptional()
  @IsInt()
  perUserLimit?: number;

  @IsOptional()
  @IsDecimal()
  @Type(() => Number)
  minPurchase?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class RDCouponDto {
  @IsOptional()
  @IsString()
  couponId!: string;
}

export class ApplyCouponDto {
  @IsNotEmpty()
  @IsString()
  couponCode!: string;

  @IsNotEmpty()
  @IsDecimal()
  @Type(() => Number)
  subtotal!: number;
}
