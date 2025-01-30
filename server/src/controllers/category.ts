import { Request, Response } from "express";
import logger from "@/config/logger";
import CategoryModel from "@/models/category";
import { sendResponse } from "@/utils/helper";

// create or Update Categories
export const createCategories = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, false, "Items array is required.");
    }

    const addOps = items.map((item: any) => {
      if (!item.name) {
        throw new Error("Each item must have a name.");
      }
      return CategoryModel.updateOne({ name: item.name }, item, {
        upsert: true,
      });
    });

    await Promise.all(addOps);
    sendResponse(res, 201, true, "Categories created successfully");
  } catch (error) {
    logger.error("Error creating category: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get All Categories
export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    sendResponse(res, 200, true, "Categories fetched successfully.", {
      categories,
    });
  } catch (error) {
    logger.error("Error fetching categories: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get Category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId)
      return sendResponse(res, 400, false, "Category ID is required.");

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return sendResponse(res, 404, false, "Category not found.");
    }

    sendResponse(res, 200, true, "Category fetched successfully.", {
      category,
    });
  } catch (error) {
    logger.error("Error fetching category: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// delete Category By ID
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return sendResponse(res, 404, false, "Category not found.");
    }

    sendResponse(res, 200, true, "Category deleted successfully.");
  } catch (error) {
    logger.error("Error deleting category: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};
