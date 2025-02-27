import { Request, Response } from "express";
import ShippingZoneModel from "@/models/shipping";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { validateRequest } from "@/config/zod";
import { calcShippingSchema, shippingZoneSchema } from "@/schemas/shipping";
import { calcShippingCost, meetsFreeShipping } from "@/config/shipping";

export const createShippingZone = async (req: Request, res: Response) => {
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

export const getShippingZone = async (req: Request, res: Response) => {
  try {
    const { country } = req.body;

    const shippingZone = await ShippingZoneModel.findOne({
      $or: [{ countries: country }, { isDefault: true }],
      isActive: true,
    });

    if (!shippingZone) return sendResponse(res, 404, "No shipping zone found");

    sendResponse(res, 200, "shipping zone fetched successfully", {
      shippingZone,
    });
  } catch (error) {
    handleError(res, "Error fetching shipping zone", error);
  }
};

export const updateShippingZone = async (req: Request, res: Response) => {
  try {
    const zoneId = req.params.zoneId;
    if (!zoneId) return sendResponse(res, 400, "zoneId is required");
    const shippingData = validateRequest(shippingZoneSchema, req.body);

    const shippingZone = await ShippingZoneModel.findByIdAndUpdate(
      zoneId,
      shippingData,
      { new: true }
    );

    if (!shippingZone) return sendResponse(res, 404, "Shipping Zone not found");

    sendResponse(res, 200, "shipping zone updated successfully", {
      shippingZone,
    });
  } catch (error) {
    handleError(res, "Error updating shipping zone", error);
  }
};

export const deleteShippingZone = async (req: Request, res: Response) => {
  try {
    const zoneId = req.params.zoneId;
    if (!zoneId) return sendResponse(res, 400, "zoneId is required");

    const shippingZone = await ShippingZoneModel.findByIdAndDelete(zoneId);

    if (!shippingZone) return sendResponse(res, 404, "Shipping zone not found");

    sendResponse(res, 200, "Shipping zone deleted successfully");
  } catch (error) {
    handleError(res, "Error deleting shipping zone", error);
  }
};

export const calculateShipping = async (req: Request, res: Response) => {
  try {
    const { items, country, subtotal, couponId } = validateRequest(
      calcShippingSchema,
      req.body
    );

    const shippingZone = await ShippingZoneModel.findOne({
      $or: [{ countries: country }, { isDefault: true }],
      isActive: true,
    });

    if (!shippingZone)
      return sendResponse(res, 404, "No shipping zones available");

    const shippingCost = items.reduce((total: number, item) => {
      const method = shippingZone.shippingMethods.find((method) =>
        method.categoryOverrides.includes(item.categoryId as any)
      );

      if (!method) return total;

      const pricing =
        method.categoryOverrides.find(
          (override) => override.category === item.categoryId
        )?.pricing || method.pricing;

      if (
        method.type === "freeShipping" &&
        meetsFreeShipping(method, { subtotal, couponId })
      )
        return total;

      return (
        total +
        calcShippingCost(pricing, { qty: item.quantity, cost: subtotal })
      );
    }, 0);

    sendResponse(res, 200, "Shipping cost calculated successfully", {
      shippingCost,
    });
  } catch (error) {
    handleError(res, "Error calculating shipping cost", error);
  }
};
