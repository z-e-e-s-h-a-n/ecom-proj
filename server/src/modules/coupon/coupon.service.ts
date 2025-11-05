import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import {
  ApplyCouponDto,
  CUCouponDto,
  RDCouponDto,
} from "@/common/dto/coupon.dto";
import type { Request } from "express";

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async createCoupon(dto: CUCouponDto) {
    const coupon = await this.prisma.coupon.create({ data: dto });

    return { message: "Coupon created successfully", data: { coupon } };
  }

  async updateCoupon(dto: CUCouponDto, couponId: string) {
    const coupon = await this.prisma.coupon.update({
      where: { id: couponId },
      data: dto,
    });
    return { message: "Coupon updated successfully", data: { coupon } };
  }

  async getCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      where: { isActive: true },
    });
    return { message: "Coupons fetched", data: { coupons } };
  }

  async getCoupon(dto: RDCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: dto.couponId },
    });
    return { message: "Coupon fetched", data: { coupon } };
  }

  async deleteCoupon(dto: RDCouponDto) {
    const coupon = await this.prisma.coupon.delete({
      where: { id: dto.couponId },
    });
    return { message: "Coupon Deleted", data: { coupon } };
  }

  async getUserCoupons(req: Request) {
    const userId = req.user!.id;

    const userCoupons = await this.prisma.userCoupon.findMany({
      where: { userId },
    });

    return { message: "Coupons Fetched Successfully", data: { userCoupons } };
  }

  async applyUserCoupon(dto: ApplyCouponDto, req: Request) {
    const userId = req.user!.id;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.couponCode },
    });

    if (!coupon || !coupon.isActive)
      throw new NotFoundException("Coupon not found or inactive");

    if (coupon.usedCount >= coupon.usageLimit)
      throw new BadRequestException("Coupon usage limit reached");

    const userUsed = await this.prisma.userCoupon.findMany({
      where: { userId, couponId: coupon.id },
    });
    if (coupon.perUserLimit >= userUsed.length) {
      throw new BadRequestException("User already used this coupon");
    }

    const { subtotal } = dto;
    let discountAmount = 0;

    switch (coupon.type) {
      case "percentage":
        discountAmount = (Number(subtotal) * Number(coupon.value)) / 100;
        break;
      case "fixedAmount":
        discountAmount = Math.min(Number(coupon.value), Number(subtotal));
        break;
      default:
        discountAmount = 0;
    }

    if (coupon.minPurchase && subtotal < Number(coupon.minPurchase))
      throw new BadRequestException(
        "Cart total does not meet coupon minimum purchase requirement"
      );

    await this.prisma.userCoupon.create({
      data: {
        userId,
        couponId: coupon.id,
        usedAt: new Date(),
      },
    });

    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });

    return {
      message: "Coupon applied successfully",
      data: {
        coupon: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
        },
        discountAmount,
        newTotal: Number(subtotal) - discountAmount,
      },
    };
  }
}
