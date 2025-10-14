import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CUCategoryDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class RDCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
