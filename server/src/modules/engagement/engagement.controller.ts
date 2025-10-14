import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { ProductEngagementService } from "./engagement.service";
import type { Request } from "express";
import type {
  AddToCartDto,
  AddToWishlistDto,
  UpdateCartDto,
} from "@/common/dto/engagement.dto";

@Controller("engagements")
export class ProductEngagementController {
  constructor(private readonly service: ProductEngagementService) {}

  // ---------------- CART ---------------- \\
  @Get("/cart")
  async getCart(@Req() req: Request) {
    return this.service.getCart(req);
  }

  @Post("/cart")
  async addToCart(@Req() req: Request, @Body() dto: AddToCartDto) {
    return this.service.addToCart(dto, req);
  }

  @Put("/cart/:cartId")
  async updateCart(
    @Param("cartId") cartId: string,
    @Body() dto: UpdateCartDto
  ) {
    return this.service.updateCart(dto, cartId);
  }

  @Delete("/cart/:cartId")
  async removeFromCart(@Param("cartId") cartId: string) {
    return this.service.removeFromCart(cartId);
  }

  // ---------------- WISHLIST ---------------- \\
  @Get("/wishlist")
  async getWishlist(@Req() req: Request) {
    return this.service.getWishlist(req);
  }

  @Post("/wishlist")
  async addToWishlist(@Req() req: Request, @Body() dto: AddToWishlistDto) {
    return this.service.addToWishlist(dto, req);
  }

  @Delete("/wishlist/:id")
  async removeFromWishlist(@Param("wishlistId") wishlistId: string) {
    return this.service.removeFromWishlist(wishlistId);
  }
}
