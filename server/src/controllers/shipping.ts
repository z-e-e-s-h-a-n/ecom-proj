import { Request, Response } from "express";
import ShippingZoneModel from "@/models/shipping";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { validateRequest } from "@/config/zod";
import {
  calcShippingSchema,
  shippingMethodSchema,
  shippingZoneSchema,
} from "@workspace/shared/schemas/shipping";
import { calcShippingCost, meetsFreeShipping } from "@/config/shipping";

const findShippingZone = async (country: string) => {
  return await ShippingZoneModel.findOne({
    $or: [{ countries: country }, { isDefault: true }],
    isActive: true,
  });
};

export const addShippingZone = async (req: Request, res: Response) => {
  try {
    const shippingData = validateRequest(shippingZoneSchema, req.body);
    const shippingZone = await ShippingZoneModel.create(shippingData);

    sendResponse(res, 201, "Shipping Zone created successfully", {
      shippingZone,
    });
  } catch (error) {
    handleError(res, "Error creating Shipping Zone", error);
  }
};

export const addShippingMethod = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    const shippingMethod = validateRequest(shippingMethodSchema, req.body);

    const shippingZone = await ShippingZoneModel.findById(zoneId);
    if (!shippingZone) return sendResponse(res, 404, "Shipping Zone not found");

    await ShippingZoneModel.findByIdAndUpdate(
      zoneId,
      { $push: { methods: shippingMethod } },
      { new: true }
    );

    sendResponse(res, 200, "Shipping method added successfully", {
      shippingZone,
    });
  } catch (error) {
    handleError(res, "Error adding shipping method", error);
  }
};

export const getShippingZone = async (req: Request, res: Response) => {
  try {
    const shippingZone = await findShippingZone(req.body.country);
    if (!shippingZone) return sendResponse(res, 404, "No shipping zone found");
    sendResponse(res, 200, "Shipping zone fetched successfully", {
      shippingZone,
    });
  } catch (error) {
    handleError(res, "Error fetching shipping zone", error);
  }
};

export const updateShippingZone = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    if (!zoneId) return sendResponse(res, 400, "zoneId is required");
    const shippingData = validateRequest(shippingZoneSchema, req.body);

    const shippingZone = await ShippingZoneModel.findByIdAndUpdate(
      zoneId,
      shippingData,
      { new: true }
    );

    if (!shippingZone) return sendResponse(res, 404, "Shipping Zone not found");
    sendResponse(res, 200, "Shipping zone updated successfully", {
      shippingZone,
    });
  } catch (error) {
    handleError(res, "Error updating shipping zone", error);
  }
};

export const updateShippingMethod = async (req: Request, res: Response) => {
  try {
    const { zoneId, methodId } = req.params;
    const updatedMethodData = validateRequest(shippingMethodSchema, req.body);

    const updatedShippingZone = await ShippingZoneModel.findOneAndUpdate(
      { _id: zoneId, "shippingMethods._id": methodId },
      { $set: { "shippingMethods.$": updatedMethodData } },
      { new: true }
    );

    if (!updatedShippingZone)
      return sendResponse(res, 404, "Shipping Zone or Method not found");

    sendResponse(res, 200, "Shipping method updated successfully", {
      shippingZone: updatedShippingZone,
    });
  } catch (error) {
    handleError(res, "Error updating shipping method", error);
  }
};

export const deleteShippingZone = async (req: Request, res: Response) => {
  try {
    const shippingZone = await ShippingZoneModel.findByIdAndDelete(
      req.params.zoneId
    );
    if (!shippingZone) return sendResponse(res, 404, "Shipping zone not found");
    sendResponse(res, 200, "Shipping zone deleted successfully");
  } catch (error) {
    handleError(res, "Error deleting shipping zone", error);
  }
};

export const deleteShippingMethod = async (req: Request, res: Response) => {
  try {
    const { zoneId, methodId } = req.params;

    const updatedShippingZone = await ShippingZoneModel.findByIdAndUpdate(
      zoneId,
      { $pull: { shippingMethods: { _id: methodId } } },
      { new: true }
    );

    if (!updatedShippingZone)
      return sendResponse(res, 404, "Shipping Zone not found");

    sendResponse(res, 200, "Shipping method deleted successfully", {
      shippingZone: updatedShippingZone,
    });
  } catch (error) {
    handleError(res, "Error deleting shipping method", error);
  }
};

export const calculateShipping = async (req: Request, res: Response) => {
  try {
    const { items, country } = validateRequest(calcShippingSchema, req.body);

    const shippingZone = await findShippingZone(country);
    if (!shippingZone)
      return sendResponse(res, 404, "No shipping zones available");

    const shippingMethod = shippingZone.methods.find(
      (method) => method.type === "standard"
    );

    if (!shippingMethod)
      return sendResponse(res, 404, "Standard shipping method not found");

    const shippingCost = items.reduce((total: number, item) => {
      if (meetsFreeShipping(shippingMethod, item)) return total;
      return total + calcShippingCost(shippingMethod, item);
    }, 0);

    sendResponse(res, 200, "Shipping cost calculated successfully", {
      shippingCost,
    });
  } catch (error) {
    handleError(res, "Error calculating shipping cost", error);
  }
};
