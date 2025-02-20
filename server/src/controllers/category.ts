import { Request, Response } from "express";
import CategoryModel from "@/models/category";
import { handleError, sendResponse } from "@/lib/utils/helper";

// create or Update Categories
export const createCategories = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0)
      return sendResponse(res, 400, "Items array is required.");

    const addOps = items.map((item: any) => {
      if (!item.name) {
        throw new Error("Each item must have a name.");
      }
      return CategoryModel.updateOne({ name: item.name }, item, {
        upsert: true,
      });
    });

    await Promise.all(addOps);
    sendResponse(res, 201, "Categories created successfully");
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
export const getCategoryById = async (req: Request, res: Response) => {
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
