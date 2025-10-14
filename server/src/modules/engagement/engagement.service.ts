import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  AddToCartDto,
  AddToWishlistDto,
  UpdateCartDto,
} from "@/common/dto/engagement.dto";
import type { Request } from "express";

@Injectable()
export class ProductEngagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------- CART ---------------- \\
  async getCart(req: Request) {
    const userId = req.user!.id;
    const cart = await this.prisma.productEngagement.findMany({
      where: { userId, type: "cart" },
      include: { product: true, variant: true },
    });

    return { message: "Cart fetched successfully", data: { cart } };
  }

  async addToCart(dto: AddToCartDto, req: Request) {
    const userId = req.user!.id;

    const cartItem = await this.prisma.productEngagement.create({
      data: { userId, ...dto, type: "cart" },
    });

    return { message: "Unique items added to your cart", data: { cartItem } };
  }

  async updateCart(dto: UpdateCartDto, cartId: string) {
    const cartItem = await this.prisma.productEngagement.update({
      where: { id: cartId },
      data: dto,
    });

    return { message: "Item updated in cart", data: { cartItem } };
  }

  async removeFromCart(cartId: string) {
    const cartItem = await this.prisma.productEngagement.delete({
      where: { id: cartId },
    });

    return { message: "Item removed from cart", data: { cartItem } };
  }

  // ---------------- WISHLIST ---------------- \\
  async getWishlist(req: Request) {
    const userId = req.user!.id;
    const wishlist = await this.prisma.productEngagement.findMany({
      where: { userId, type: "wishlist" },
      include: { product: true, variant: true },
    });

    return { message: "Wishlist fetched successfully", data: { wishlist } };
  }

  async addToWishlist(dto: AddToWishlistDto, req: Request) {
    const userId = req.user!.id;

    const wishlistItem = await this.prisma.productEngagement.create({
      data: { userId, ...dto, type: "wishlist" },
    });

    return {
      message: "Unique items added to your cart",
      data: { wishlistItem },
    };
  }

  async removeFromWishlist(wishlistId: string) {
    const wishlistItem = await this.prisma.productEngagement.delete({
      where: { id: wishlistId },
    });

    return { message: "Item removed from wishlist", data: { wishlistItem } };
  }
}
