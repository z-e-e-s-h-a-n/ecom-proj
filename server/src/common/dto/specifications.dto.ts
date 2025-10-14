import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from "class-validator";

export class CUSpecificationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  options!: string[];

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsArray()
  categories!: string[];
}

export class GetSpecificationsDto {
  @IsOptional()
  @IsArray()
  categories?: string[];
}

export class RDSpecificationDto {
  @IsString()
  @IsNotEmpty()
  specsId!: string;
}
