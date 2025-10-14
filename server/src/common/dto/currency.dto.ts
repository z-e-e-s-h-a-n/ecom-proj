import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CUCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  symbol!: string;

  @IsNumber()
  @IsNotEmpty()
  exchangeRate!: number;

  @IsOptional()
  @IsBoolean()
  isDefault!: boolean;

  @IsOptional()
  @IsString()
  decimalSep!: string;

  @IsOptional()
  @IsString()
  thousandSep!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2)
  country!: string;
}

export class RDCurrencyDto {
  @IsString()
  @IsNotEmpty()
  currencyId!: string;
}
