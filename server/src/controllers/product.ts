// controllers/product.ts
import { Request, Response } from "express";
import ProductModel from "@/models/product";
import { sendResponse } from "@/utils/helper";
import logger from "@/utils/logger";
import ReviewModel from "@/models/review";

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const newProduct = new ProductModel(productData);

    await newProduct.save();
    sendResponse(res, 201, true, "Product created successfully.", {
      product: newProduct,
    });
  } catch (error) {
    logger.error("Error creating product: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await ProductModel.findByIdAndUpdate(productId, updates, {
      new: true,
    });
    if (!product) {
      return sendResponse(res, 404, false, "Product not found.");
    }

    sendResponse(res, 200, true, "Product updated successfully.", { product });
  } catch (error) {
    logger.error("Error updating product: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get Product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId)
      .populate("category")
      .populate("reviews");
    if (!product) {
      return sendResponse(res, 404, false, "Product not found.");
    }

    sendResponse(res, 200, true, "Product fetched successfully.", { product });
  } catch (error) {
    logger.error("Error fetching product: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get All Products
export const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await ProductModel.find().populate("category");
    sendResponse(res, 200, true, "Products fetched successfully.", {
      products,
    });
  } catch (error) {
    logger.error("Error fetching products: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found.");
    }

    sendResponse(res, 200, true, "Product deleted successfully.");
  } catch (error) {
    logger.error("Error deleting product: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Add Review For a product
export const addReview = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { rating, comment } = req.body;

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
      rating,
      comment,
    });

    sendResponse(res, 201, true, "Review added successfully", { review });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to add review");
  }
};

// Get Reviews for a Product
export const getReviewsForProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const reviews = await ReviewModel.find({ productId })
      .populate("userId", "name email")
      .exec();

    sendResponse(res, 200, true, "Reviews fetched successfully", { reviews });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch reviews");
  }
};
