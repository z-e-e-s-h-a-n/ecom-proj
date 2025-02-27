import { Request, Response } from "express";
import AttributeModel from "@/models/attribute";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { validateRequest } from "@/config/zod";
import { attributeSchema } from "@/schemas/attribute";

export const createAttribute = async (req: Request, res: Response) => {
  try {
    const attribute = validateRequest(attributeSchema, req.body);
    await AttributeModel.create(attribute);

    sendResponse(res, 201, "Attributes created successfully");
  } catch (error) {
    handleError(res, "Error creating attributes: ", error);
  }
};

export const getAttributes = async (req: Request, res: Response) => {
  try {
    const categories = req.query.categories;

    const query =
      categories && Array.isArray(categories)
        ? { categories: { $in: categories } }
        : {};

    const attributes = await AttributeModel.find(query).populate("categories");
    sendResponse(res, 200, "Attributes fetched successfully.", {
      attributes,
    });
  } catch (error) {
    handleError(res, "Error fetching attributes: ", error);
  }
};

export const getAttribute = async (req: Request, res: Response) => {
  try {
    const { attrId } = req.params;
    if (!attrId) return sendResponse(res, 400, "Attribute ID is required.");

    const attribute =
      await AttributeModel.findById(attrId).populate("categories");
    if (!attribute) return sendResponse(res, 404, "Attribute not found.");

    sendResponse(res, 200, "Attribute fetched successfully.", {
      attribute,
    });
  } catch (error) {
    handleError(res, "Error fetching attribute: ", error);
  }
};

export const deleteAttribute = async (req: Request, res: Response) => {
  try {
    const { attrId } = req.params;
    if (!attrId) return sendResponse(res, 400, "Attribute ID is required.");

    const attribute = await AttributeModel.findByIdAndDelete(attrId);
    if (!attribute) return sendResponse(res, 404, "Attribute not found.");

    sendResponse(res, 200, "Attribute deleted successfully.");
  } catch (error) {
    handleError(res, "Error deleting attribute: ", error);
  }
};
