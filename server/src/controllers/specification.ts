import { Request, Response } from "express";
import SpecificationModel from "@/models/specification";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { specificationSchema } from "@/schemas/specification";
import { validateRequest } from "@/config/zod";

// Create Specification
export const createSpecification = async (req: Request, res: Response) => {
  try {
    const specification = validateRequest(specificationSchema, req.body);
    await SpecificationModel.create(specification);

    sendResponse(res, 201, "Specification created successfully.");
  } catch (error) {
    handleError(res, "Error creating specification: ", error);
  }
};

// Get Specification by ID
export const getSpecification = async (req: Request, res: Response) => {
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
export const getSpecifications = async (_: Request, res: Response) => {
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
export const deleteSpecification = async (req: Request, res: Response) => {
  try {
    const { specsId } = req.params;
    if (!specsId)
      return sendResponse(res, 400, "Specification ID is required.");

    const Specs = await SpecificationModel.findByIdAndDelete(specsId);
    if (!Specs) return sendResponse(res, 404, "Specification not found.");

    sendResponse(res, 200, "Specification deleted successfully.");
  } catch (error) {
    handleError(res, "Error deleting specification: ", error);
  }
};
