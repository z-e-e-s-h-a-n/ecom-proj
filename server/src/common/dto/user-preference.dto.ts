import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ThemeType } from "@prisma/client";

export class UpdateUserPreferenceDto {
  @IsOptional()
  @IsEnum(ThemeType)
  themeMode?: ThemeType;

  @IsOptional()
  @IsBoolean()
  compactMode?: boolean;

  @IsOptional()
  @IsBoolean()
  newsletter?: boolean;

  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  dataSharingConsent?: boolean;

  @IsOptional()
  @IsString()
  languageRegion?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
