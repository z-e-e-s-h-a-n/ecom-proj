// controllers/product.ts
import { Request, Response } from "express";
import ProductModel from "@/models/product";
import { sendResponse } from "@/utils/helper";
import logger from "@/config/logger";

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return sendResponse(res, 400, false, "Invalid products data.");
    }

    const savedProducts = await Promise.all(
      products.map(async (product: any) => {
        const newProduct = await ProductModel.create(product);
        return newProduct;
      })
    );

    sendResponse(res, 201, true, "Products created successfully.", {
      products: savedProducts,
    });
  } catch (error) {
    logger.error("Error creating products: ", error);
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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return sendResponse(res, 400, false, "Product ID is required.");

    const product = await ProductModel.findById(productId)
      .populate("category")
      .populate("reviews")
      .populate("specifications.id")
      .populate("attributes.id")
      .setOptions({ req })
      .lean()
      .exec();

    if (!product) return sendResponse(res, 404, false, "Product not found.");

    sendResponse(res, 200, true, "Product fetched successfully.", { product });
  } catch (error) {
    logger.error("Error fetching product:", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find()
      .populate("category")
      .setOptions({ req })
      .lean()
      .exec();

    sendResponse(res, 200, true, "Products fetched successfully.", {
      products,
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
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
