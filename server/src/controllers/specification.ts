import { Request, Response } from "express";
import SpecificationModel from "@/models/specification";
import { handleError, sendResponse } from "@/lib/utils/helper";

// Create Specification
export const createSpecs = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0)
      return sendResponse(res, 400, "Items array is required.");

    const addOps = items.map((item: any) => {
      if (!item.name) {
        throw new Error("Each item must have a name.");
      }
      return SpecificationModel.updateOne({ name: item.name }, item, {
        upsert: true,
      });
    });

    await Promise.all(addOps);
    sendResponse(res, 201, "Specification created successfully.");
  } catch (error) {
    handleError(res, "Error creating specification: ", error);
  }
};

// Get Specification by ID
export const getSpecsById = async (req: Request, res: Response) => {
  try {
    const { specsId } = req.params;
    if (!specsId)
      return sendResponse(res, 400, "Specification ID is required.");

    const specification =
      await SpecificationModel.findById(specsId).populate("categories");
    if (!specification)
      return sendResponse(res, 404, "Specification not found.");

    sendResponse(res, 200, "Specification fetched successfully.", {
      specification,
    });
  } catch (error) {
    handleError(res, "Error fetching specification: ", error);
  }
};

// Get All Specifications
export const getSpecs = async (_: Request, res: Response) => {
  try {
    const specifications =
      await SpecificationModel.find().populate("categories");
    sendResponse(res, 200, "Specifications fetched successfully.", {
      specifications,
    });
  } catch (error) {
    handleError(res, "Error fetching specifications: ", error);
  }
};

// Delete Specification
export const deleteSpecs = async (req: Request, res: Response) => {
  try {
    const { specsId } = req.params;
    const Specs = await SpecificationModel.findByIdAndDelete(specsId);
    if (!Specs) return sendResponse(res, 404, "Specification not found.");

    sendResponse(res, 200, "Specification deleted successfully.");
  } catch (error) {
    handleError(res, "Error deleting specification: ", error);
  }
};
