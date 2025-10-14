import { ReviewStatus } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  comment!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateReviewDto {
  @IsEnum(ReviewStatus)
  status!: ReviewStatus;
}

export class DeleteReviewDto {
  @IsString()
  @IsNotEmpty()
  reviewId!: string;
}
