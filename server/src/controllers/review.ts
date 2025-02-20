import { Request, Response } from "express";
import ReviewModel from "@/models/review";
import { handleError, sendResponse } from "@/lib/utils/helper";

// Add Review For a product
export const addReview = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { productId } = req.params;
  const { rating, comment, variantId } = req.body;

  try {
    const existingReview = await ReviewModel.findOne({ userId, productId });

    if (existingReview)
      return sendResponse(res, 400, "You have already reviewed this product.");

    const review = await ReviewModel.create({
      userId,
      productId,
      variantId,
      rating,
      comment,
    });

    sendResponse(res, 201, "Review added successfully", { review });
  } catch (error) {
    handleError(res, "Failed to add review", error);
  }
};

// Get Reviews for a Product
export const getReviews = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const reviews = await ReviewModel.find({ productId })
      .populate("userId", "name email")
      .populate("items.productId");

    sendResponse(res, 200, "Reviews fetched successfully", { reviews });
  } catch (error) {
    handleError(res, "Failed to fetch reviews", error);
  }
};

// Delete Review For a Product
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const Review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!Review) return sendResponse(res, 404, "Review not found.");

    sendResponse(res, 200, "Review deleted successfully.");
  } catch (error) {
    handleError(res, "Failed to delete review", error);
  }
};
