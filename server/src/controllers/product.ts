// controllers/product.ts
import { Request, Response } from "express";
import ProductModel from "@/models/product";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { validateRequest } from "@/config/zod";
import { productSchema } from "@/schemas/product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = validateRequest(productSchema, req.body);
    const product = await ProductModel.create(productData);

    sendResponse(res, 201, "Products created successfully.", {
      product,
    });
  } catch (error) {
    handleError(res, "Error creating products:", error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) return sendResponse(res, 400, "Product ID is required.");
    const productData = validateRequest(productSchema, req.body);

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
      }
    );
    if (!product) return sendResponse(res, 404, "Product not found.");

    sendResponse(res, 200, "Product updated successfully.", { product });
  } catch (error) {
    handleError(res, "Error updating product:", error);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) return sendResponse(res, 400, "Product ID Requires");

    const product = await ProductModel.findById(productId).populate([
      "category",
      "reviews",
      "specifications.id",
      "attributes.id",
      "variations.pricing.currencyId",
    ]);

    if (!product) return sendResponse(res, 404, "Product not found.");

    sendResponse(res, 200, "Product fetched successfully.", { product });
  } catch (error) {
    handleError(res, "Error fetching product:", error);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "price_asc",
      searchQuery = "",
      ...filters
    } = req.query;
    const query: any = {};

    // Category filter
    if (filters.categories) query.category = { $in: filters?.categories };

    // Search query
    if (searchQuery) {
      const regex = new RegExp(searchQuery as string, "i");
      query.name = { $regex: regex };
    }

    // Attribute filters
    const attributeFilters = Object.keys(filters)
      .filter((key) => key.startsWith("attr_") && filters[key])
      .map((key) => ({
        attributes: {
          $elemMatch: {
            id: key.replace("attr_", ""),
            options: { $in: filters[key] },
          },
        },
      }));

    if (attributeFilters.length > 0) query.$and = attributeFilters;

    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      const min = parseFloat(filters.minPrice as string) || 0;
      const max = parseFloat(filters.maxPrice as string) || Infinity;
      query.variations = {
        $elemMatch: {
          isDefault: true,
          "pricing.0.original": { $gte: min, $lte: max },
        },
      };
    }

    // Sorting options
    const sortOptions: Record<string, string> = {
      price_asc: "variations.0.pricing.0.original",
      price_desc: "-variations.0.pricing.0.original",
      createdAt_asc: "createdAt",
      createdAt_desc: "-createdAt",
      name_asc: "name",
      name_desc: "-name",
    };
    const sortQuery = sortOptions[sort as string];

    // Fetch products with pagination and population
    const products = await ProductModel.find(query)
      .populate([
        "category",
        "reviews",
        "specifications.id",
        "attributes.id",
        "variations.pricing.currencyId",
      ])
      .sort(sortQuery)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await ProductModel.countDocuments(query);

    sendResponse(res, 200, "Products fetched successfully.", {
      products: products.map((product) => ({ product })),
      total,
      page,
      limit,
    });
  } catch (error) {
    handleError(res, "Error fetching products:", error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) return sendResponse(res, 404, "Product not found.");

    sendResponse(res, 200, "Product deleted successfully.");
  } catch (error) {
    handleError(res, "Error deleting product:", error);
  }
};
