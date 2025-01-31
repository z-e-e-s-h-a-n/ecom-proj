import { Request, Response } from "express";
import CurrencyOptionModel from "@/models/currency";
import { setCookie, lookupIPInfo, sendResponse } from "@/utils/helper";
import logger from "@/config/logger";

export const getAllCurrencies = async (_req: Request, res: Response) => {
  try {
    const currencies = await CurrencyOptionModel.find();
    sendResponse(res, 200, true, "Currency options retrieved.", { currencies });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to retrieve currency options.");
  }
};

export const createCurrency = async (req: Request, res: Response) => {
  const { currencies } = req.body;

  if (!Array.isArray(currencies) || currencies.length === 0) {
    return sendResponse(res, 400, false, "Invalid input data.");
  }

  try {
    for (const data of currencies) {
      if (data.isDefault) {
        await CurrencyOptionModel.updateMany({}, { isDefault: false });
      }

      const newCurrency = new CurrencyOptionModel(data);
      await newCurrency.save();
    }

    sendResponse(res, 201, true, "Multiple currency options created.");
  } catch (error) {
    sendResponse(res, 500, false, "Error creating multiple currency options.");
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    if (updates.isDefault) {
      await CurrencyOptionModel.updateMany({}, { isDefault: false });
    }

    const updatedCurrency = await CurrencyOptionModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedCurrency)
      return sendResponse(res, 404, false, "Currency option not found.");

    sendResponse(res, 200, true, "Currency option updated.", updatedCurrency);
  } catch (error) {
    sendResponse(res, 500, false, "Error updating currency option.");
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const deletedCurrency = await CurrencyOptionModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCurrency)
      return sendResponse(res, 404, false, "Currency option not found.");

    sendResponse(res, 200, true, "Currency option deleted.");
  } catch (error) {
    sendResponse(res, 500, false, "Error deleting currency option.");
  }
};

export const getCurrencyInfo = async (req: Request, res: Response) => {
  try {
    const { currency } = req.params;

    let currencyInfo = undefined;

    if (currency && currency !== "undefined") {
      currencyInfo = await CurrencyOptionModel.findOne({ currency }).lean();
    } else {
      const defaultCurrency = await CurrencyOptionModel.findOne({
        isDefault: true,
      }).lean();
      const ipInfo = await lookupIPInfo(req, defaultCurrency);
      currencyInfo = ipInfo?.data ?? ipInfo.fallback;
    }

    if (!currencyInfo) {
      return sendResponse(res, 404, false, "Currency not found");
    }

    setCookie(res, "currencyInfo", currencyInfo, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, 200, true, "Currency retrieved", { currencyInfo });
  } catch (error) {
    logger.error("Error fetching currency or location info:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};
