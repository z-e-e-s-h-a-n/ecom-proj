import { Request, Response } from "express";
import CategoryModel from "@/models/category";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { categorySchema } from "@workspace/shared/schemas/category";
import { validateRequest } from "@/config/zod";

// create or Update Categories
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = validateRequest(categorySchema, req.body);
    const category = await CategoryModel.create(categoryData);

    sendResponse(res, 201, "Categories created successfully", {
      category,
    });
  } catch (error) {
    handleError(res, "Error creating categories: ", error);
  }
};

// Get All Categories
export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    sendResponse(res, 200, "Categories fetched successfully.", {
      categories,
    });
  } catch (error) {
    handleError(res, "Error fetching categories: ", error);
  }
};

// Get Category by ID
export const getCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) return sendResponse(res, 400, "Category ID is required.");

    const category = await CategoryModel.findById(categoryId);
    if (!category) return sendResponse(res, 404, "Category not found.");

    sendResponse(res, 200, "Category fetched successfully.", {
      category,
    });
  } catch (error) {
    handleError(res, "Error fetching category: ", error);
  }
};

// delete Category By ID
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) return sendResponse(res, 404, "Category not found.");

    sendResponse(res, 200, "Category deleted successfully.");
  } catch (error) {
    handleError(res, "Error deleting category: ", error);
  }
};
