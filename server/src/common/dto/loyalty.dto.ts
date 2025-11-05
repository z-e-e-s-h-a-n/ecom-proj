import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { LoyaltyAction, LoyaltyTransactionType } from "@prisma/client";

export class CULoyaltyRuleDto {
  @IsEnum(LoyaltyAction)
  action!: LoyaltyAction;

  @IsNotEmpty()
  @IsInt()
  points!: number;

  @IsOptional()
  @IsDecimal()
  ratio?: number;

  @IsOptional()
  @IsDecimal()
  minOrderAmount?: number;

  @IsOptional()
  @IsInt()
  maxPoints?: number;

  @IsOptional()
  @IsInt()
  expiresInDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class RDLoyaltyRuleDto {
  @IsNotEmpty()
  @IsString()
  ruleId!: string;
}

export class CreateLoyaltyTransactionDto {
  @IsInt()
  points!: number;

  @IsEnum(LoyaltyTransactionType)
  type!: LoyaltyTransactionType;

  @IsEnum(LoyaltyAction)
  action!: LoyaltyAction;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;
}
