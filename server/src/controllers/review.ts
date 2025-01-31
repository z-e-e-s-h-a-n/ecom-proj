import { Request, Response } from "express";
import logger from "@/config/logger";
import ReviewModel from "@/models/review";
import { sendResponse } from "@/utils/helper";

// Add Review For a product
export const addReview = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { productId } = req.params;
  const { rating, comment, variantId } = req.body;

  try {
    const existingReview = await ReviewModel.findOne({ userId, productId });

    if (existingReview) {
      return sendResponse(
        res,
        400,
        false,
        "You have already reviewed this product."
      );
    }

    const review = await ReviewModel.create({
      userId,
      productId,
      variantId,
      rating,
      comment,
    });

    sendResponse(res, 201, true, "Review added successfully", { review });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to add review");
  }
};

// Get Reviews for a Product
export const getReviews = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const reviews = await ReviewModel.find({ productId })
      .populate("userId", "name email")
      .populate({
        path: "items.productId",
        options: { req },
      })
      .lean()
      .exec();

    sendResponse(res, 200, true, "Reviews fetched successfully", { reviews });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch reviews");
  }
};

// Delete Review For a Product
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const Review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!Review) {
      return sendResponse(res, 404, false, "Review not found.");
    }

    sendResponse(res, 200, true, "Review deleted successfully.");
  } catch (error) {
    logger.error("Error deleting Review: ", error);
    sendResponse(res, 500, false, "Failed to delete review");
  }
};
