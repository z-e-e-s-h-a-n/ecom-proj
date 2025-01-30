import { Request, Response } from "express";
import logger from "@/config/logger";
import SpecificationModel from "@/models/specification";
import { sendResponse } from "@/utils/helper";

// Create Specification
export const createSpecs = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, false, "Items array is required.");
    }

    const addOps = items.map((item: any) => {
      if (!item.name) {
        throw new Error("Each item must have a name.");
      }
      return SpecificationModel.updateOne({ name: item.name }, item, {
        upsert: true,
      });
    });

    await Promise.all(addOps);
    sendResponse(res, 201, true, "Specification created successfully.");
  } catch (error) {
    logger.error("Error creating specification: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get Specification by ID
export const getSpecsById = async (req: Request, res: Response) => {
  try {
    const { specsId } = req.params;
    if (!specsId)
      return sendResponse(res, 400, false, "Specification ID is required.");

    const specification =
      await SpecificationModel.findById(specsId).populate("categories");
    if (!specification) {
      return sendResponse(res, 404, false, "Specification not found.");
    }

    sendResponse(res, 200, true, "Specification fetched successfully.", {
      specification,
    });
  } catch (error) {
    logger.error("Error fetching specification: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Get All Specifications
export const getSpecs = async (_: Request, res: Response) => {
  try {
    const specifications =
      await SpecificationModel.find().populate("categories");
    sendResponse(res, 200, true, "Specifications fetched successfully.", {
      specifications,
    });
  } catch (error) {
    logger.error("Error fetching specifications: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};

// Delete Specification
export const deleteSpecs = async (req: Request, res: Response) => {
  try {
    const { specsId } = req.params;
    const Specs = await SpecificationModel.findByIdAndDelete(specsId);
    if (!Specs) {
      return sendResponse(res, 404, false, "Specification not found.");
    }

    sendResponse(res, 200, true, "Specification deleted successfully.");
  } catch (error) {
    logger.error("Error deleting specification: ", error);
    sendResponse(res, 500, false, "Internal server error.");
  }
};
