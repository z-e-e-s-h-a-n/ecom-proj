import { AddressLabel, AddressType } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CUAddressDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @IsOptional()
  @IsEnum(AddressLabel)
  label?: AddressLabel;
}

export class RDAddressDto {
  @IsString()
  @IsNotEmpty()
  addressId!: string;
}
