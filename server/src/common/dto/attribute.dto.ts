import { AttributeType } from "@prisma/client";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
} from "class-validator";

export class CUAttributeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(AttributeType)
  type!: AttributeType;

  @IsArray()
  @IsString({ each: true })
  options!: string[];

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsArray()
  @IsString({ each: true })
  categories!: string[];
}

export class GetAttributesDto {
  @IsOptional()
  @IsArray()
  categories?: string[];
}

export class RDAttributeDto {
  // Read or Delete
  @IsString()
  @IsNotEmpty()
  attrId!: string;
}
