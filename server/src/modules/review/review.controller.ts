import type {
  CreateReviewDto,
  DeleteReviewDto,
  UpdateReviewDto,
} from "@/common/dto/review.dto";
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
import { ReviewService } from "./review.service";
import { Roles } from "@/common/decorators/roles.decorator";
import type { Request } from "express";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() dto: CreateReviewDto, @Req() req: Request) {
    return this.reviewService.createReview(dto, req);
  }

  @Get()
  async getUserReviews(@Req() req: Request) {
    return this.reviewService.getUserReviews(req);
  }

  @Roles("admin")
  @Get("/all")
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Roles("admin")
  @Put("/:reviewId")
  async updateReview(
    @Body() dto: UpdateReviewDto,
    @Param("reviewId") reviewId: string
  ) {
    return this.reviewService.updateReview(dto, reviewId);
  }

  @Roles("admin")
  @Delete("/:reviewId")
  async deleteReview(@Param() dto: DeleteReviewDto) {
    return this.reviewService.deleteReview(dto);
  }
}
