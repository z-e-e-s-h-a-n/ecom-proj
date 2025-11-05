import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Req,
} from "@nestjs/common";
import { CouponService } from "./coupon.service";
import {
  CUCouponDto,
  ApplyCouponDto,
  RDCouponDto,
} from "@/common/dto/coupon.dto";
import type { Request } from "express";

@Controller("coupons")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post() createCoupon(@Body() dto: CUCouponDto) {
    return this.couponService.createCoupon(dto);
  }

  @Get() getCoupons() {
    return this.couponService.getCoupons();
  }

  @Get("/user") getUserCoupons(@Req() req: Request) {
    return this.couponService.getUserCoupons(req);
  }

  @Post("/apply") apply(@Body() dto: ApplyCouponDto) {
    return this.couponService.applyUserCoupon(dto);
  }

  @Get("/:couponId")
  async getCoupon(@Param() dto: RDCouponDto) {
    return this.couponService.getCoupon(dto);
  }

  @Put("/:couponId") updateCoupon(
    @Body() dto: CUCouponDto,
    @Param("couponId") couponId: string
  ) {
    return this.couponService.updateCoupon(dto, couponId);
  }

  @Delete("/:couponId")
  async deleteCoupon(@Param() dto: RDCouponDto) {
    return this.couponService.deleteCoupon(dto);
  }
}
