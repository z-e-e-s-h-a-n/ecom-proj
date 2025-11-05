import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateSettingDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  storeDescription?: string;

  @IsOptional()
  @IsString()
  storeLogo?: string;

  @IsOptional()
  @IsString()
  storeEmail?: string;

  @IsOptional()
  @IsString()
  storePhone?: string;

  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  tiktokUrl?: string;

  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @IsOptional()
  @IsDecimal()
  freeShippingThreshold?: number;

  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  @IsOptional()
  @IsBoolean()
  autoApproveReviews?: boolean;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsOptional()
  @IsBoolean()
  loyaltyEnabled?: boolean;

  @IsOptional()
  @IsDecimal()
  loyaltyPointValue?: number;

  @IsOptional()
  @IsBoolean()
  couponsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  wishlistEnabled?: boolean;

  @IsOptional()
  @IsInt()
  auditRetentionDays?: number;
}
