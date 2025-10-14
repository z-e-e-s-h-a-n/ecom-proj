import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

// ---------------- CART ---------------- \\
export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  priceAtAddition!: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateCartDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  priceAtAddition!: string;
}

// ---------------- WISHLIST ---------------- \\
export class AddToWishlistDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  variantId!: string;
}
