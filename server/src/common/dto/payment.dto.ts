import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  IsJSON,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentStatus, RefundStatus } from "@prisma/client";

//
// ─── Payment DTOs ──────────────────────────────────────────────
//

export class InitiatePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsNotEmpty()
  @IsString()
  methodId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsNotEmpty()
  @IsString()
  currencyId!: string;
}

export class RDPaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentId!: string;
}

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}

//
// ─── Payment Method DTOs ───────────────────────────────────────
//

export class CUPaymentMethodDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsJSON()
  meta?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  countries!: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDefault?: boolean;
}

export class RDPaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  methodId!: string;
}

//
// ─── Refund DTOs ───────────────────────────────────────────────
//

export class CreateRefundDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsNotEmpty()
  @IsString()
  paymentId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsNotEmpty()
  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  processedById?: string;
}

export class RDRefundDto {
  @IsNotEmpty()
  @IsString()
  refundId!: string;
}

export class UpdateRefundDto {
  @IsEnum(RefundStatus)
  status!: RefundStatus;
}
