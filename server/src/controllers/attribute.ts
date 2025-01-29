import { Request, Response } from "express";
import logger from "@/utils/logger";
import AttributeModel from "@/models/attribute";
import { sendResponse } from "@/utils/helper";

// create product Attributes
export const createAttributes = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, false, "Items array is required.");
    }

    const addOps = items.map((item: any) => {
      if (!item.name) {
        throw new Error("Each item must have a name.");
      }
      return AttributeModel.updateOne({ name: item.name }, item, {
        upsert: true,
      });
    });

    await Promise.all(addOps);
    sendResponse(res, 201, true, "Attributes created successfully");
  } catch (error) {
    logger.error("Error creating Attributes: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get All Attributes
export const getAttributes = async (_: Request, res: Response) => {
  try {
    const attributes = await AttributeModel.find().populate("categories");
    sendResponse(res, 200, true, "Attributes fetched successfully.", {
      attributes,
    });
  } catch (error) {
    logger.error("Error fetching attributes: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get Attribute by ID
export const getAttribute = async (req: Request, res: Response) => {
  try {
    const { attrId } = req.params;
    if (!attrId)
      return sendResponse(res, 400, false, "Attribute ID is required.");

    const attribute =
      await AttributeModel.findById(attrId).populate("categories");
    if (!attribute) {
      return sendResponse(res, 404, false, "Attribute not found.");
    }

    sendResponse(res, 200, true, "Attribute fetched successfully.", {
      attribute,
    });
  } catch (error) {
    logger.error("Error fetching attribute: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Delete Attribute by ID
export const deleteAttribute = async (req: Request, res: Response) => {
  try {
    const { attrId } = req.params;
    const attribute = await AttributeModel.findByIdAndDelete(attrId);
    if (!attribute) {
      return sendResponse(res, 404, false, "Attribute not found.");
    }

    sendResponse(res, 200, true, "Attribute deleted successfully.");
  } catch (error) {
    logger.error("Error deleting attribute: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};
