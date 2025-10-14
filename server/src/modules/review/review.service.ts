import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Request } from "express";
import type {
  CreateReviewDto,
  DeleteReviewDto,
  UpdateReviewDto,
} from "@/common/dto/review.dto";

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(dto: CreateReviewDto, req: Request) {
    const userId = req.user!.id;

    const review = await this.prisma.review.create({
      data: { userId, ...dto },
    });

    return { message: "Review added successfully", data: { review } };
  }

  async getUserReviews(req: Request) {
    const userId = req.user!.id;

    const reviews = await this.prisma.review.findMany({
      where: { userId },
    });

    return { message: "Reviews Fetched Successfully.", data: { reviews } };
  }

  async getAllReviews() {
    const reviews = await this.prisma.review.findMany();

    return { message: "Reviews Fetched Successfully.", data: { reviews } };
  }

  async updateReview(dto: UpdateReviewDto, reviewId: string) {
    const review = await this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });

    return { message: "Review updated successfully.", data: { review } };
  }

  async deleteReview(dto: DeleteReviewDto) {
    const review = await this.prisma.review.delete({
      where: { id: dto.reviewId },
    });

    return { message: "Review deleted successfully.", data: { review } };
  }
}
