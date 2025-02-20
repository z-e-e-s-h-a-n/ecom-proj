import { Request, Response } from "express";
import ShippingMethodModel from "@/models/shipping";
import { handleError, lookupIPInfo, sendResponse } from "@/lib/utils/helper";
let evaluate: any;
(async () => {
  const mathjs = await import("mathjs");
  evaluate = mathjs.evaluate;
})();

export const createShippingMethods = async (req: Request, res: Response) => {
  try {
    const shippingMethods = await ShippingMethodModel.insertMany(
      req.body.items
    );
    sendResponse(res, 201, "Shipping methods created successfully", {
      shippingMethods,
    });
  } catch (error) {
    handleError(res, "Error creating shipping methods", error);
  }
};

export const getShippingMethods = async (req: Request, res: Response) => {
  try {
    const { countries } = req.body;
    const ipInfo = await lookupIPInfo(req, null);
    const query = {
      countries: { $in: countries ? countries : [ipInfo?.data?.countryCode] },
    };

    const shippingMethod = await ShippingMethodModel.findOne(query);

    if (!shippingMethod) {
      return sendResponse(
        res,
        404,
        "No shipping methods found for the specified country"
      );
    }

    sendResponse(res, 200, "Shipping methods fetched successfully", {
      shippingMethod,
    });
  } catch (error) {
    handleError(res, "Error fetching shipping methods", error);
  }
};

export const updateShippingMethod = async (req: Request, res: Response) => {
  try {
    const shippingMethod = await ShippingMethodModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!shippingMethod) {
      return sendResponse(res, 404, "Shipping method not found");
    }

    sendResponse(res, 200, "Shipping method updated successfully", {
      shippingMethod,
    });
  } catch (error) {
    handleError(res, "Error updating shipping method", error);
  }
};

export const deleteShippingMethod = async (req: Request, res: Response) => {
  try {
    const shippingMethod = await ShippingMethodModel.findByIdAndDelete(
      req.params.id
    );

    if (!shippingMethod) {
      return sendResponse(res, 404, "Shipping method not found");
    }

    sendResponse(res, 200, "Shipping method deleted successfully");
  } catch (error) {
    handleError(res, "Error deleting shipping method", error);
  }
};

export const calculateShipping = async (req: Request, res: Response) => {
  const { items, countries } = req.body;

  try {
    const ipInfo = await lookupIPInfo(req, null);
    const query = {
      countries: { $in: countries ? countries : [ipInfo?.data?.countryCode] },
    };

    const shippingMethod = await ShippingMethodModel.findOne(query);

    if (!shippingMethod)
      return sendResponse(res, 404, "Shipping method not found");

    let shippingCost = 0;
    const orderTotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    for (const item of items) {
      const matchingMethod = shippingMethod.methods.find((method) =>
        method.categories.includes(item.category._id)
      );

      if (!matchingMethod)
        return sendResponse(
          res,
          400,
          `No applicable shipping method found for item: ${item.name}`
        );

      if (matchingMethod.type === "freeShipping") {
        if (
          matchingMethod.require === "none" ||
          (matchingMethod.require === "min" &&
            orderTotal >= parseFloat(matchingMethod.cost))
        ) {
          continue;
        }
      } else if (matchingMethod.type === "flatRate") {
        if (matchingMethod.calcType === "perOrder") {
          shippingCost += evalCostFormula(matchingMethod.cost, [item]);
        } else if (matchingMethod.calcType === "perClass") {
          shippingCost += evalCostFormula(matchingMethod.cost, [item]);
        }
      }
    }

    sendResponse(res, 200, "Shipping cost calculated successfully", {
      shippingCost,
    });
  } catch (error) {
    handleError(res, "Error calculating shipping cost", error);
  }
};

const evalCostFormula = (formula: string, items: any[]): number => {
  const qty = items.reduce((sum, item) => sum + item.quantity, 0);
  const cost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const evaluatedFormula = formula
    .replace(/\[qty\]/g, qty.toString())
    .replace(/\[cost\]/g, cost.toString());

  return evaluate(evaluatedFormula);
};
