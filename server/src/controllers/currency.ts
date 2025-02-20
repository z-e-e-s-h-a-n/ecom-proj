import { Request, Response } from "express";
import CurrencyOptionModel from "@/models/currency";
import {
  setCookie,
  lookupIPInfo,
  sendResponse,
  handleError,
} from "@/lib/utils/helper";

export const getAllCurrencies = async (_req: Request, res: Response) => {
  try {
    const currencies = await CurrencyOptionModel.find();
    sendResponse(res, 200, "Currency options retrieved.", { currencies });
  } catch (error) {
    sendResponse(res, 500, "Failed to retrieve currency options.");
  }
};

export const createCurrency = async (req: Request, res: Response) => {
  const { currencies } = req.body;

  if (!Array.isArray(currencies) || currencies.length === 0)
    return sendResponse(res, 400, "Invalid input data.");

  try {
    for (const data of currencies) {
      if (data.isDefault)
        await CurrencyOptionModel.updateMany({}, { isDefault: false });

      const newCurrency = new CurrencyOptionModel(data);
      await newCurrency.save();
    }

    sendResponse(res, 201, "Multiple currency options created.");
  } catch (error) {
    handleError(res, "Error creating currency options.", error);
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    if (updates.isDefault)
      await CurrencyOptionModel.updateMany({}, { isDefault: false });

    const updatedCurrency = await CurrencyOptionModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedCurrency)
      return sendResponse(res, 404, "Currency option not found.");

    sendResponse(res, 200, "Currency option updated.", updatedCurrency);
  } catch (error) {
    handleError(res, "Error updating currency option.", error);
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const deletedCurrency = await CurrencyOptionModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCurrency)
      return sendResponse(res, 404, "Currency option not found.");

    sendResponse(res, 200, "Currency option deleted.");
  } catch (error) {
    handleError(res, "Error deleting currency option.", error);
  }
};

export const getCurrencyInfo = async (req: Request, res: Response) => {
  try {
    const { currency } = req.params;
    let currencyInfo;

    if (currency && currency !== "undefined") {
      currencyInfo = await CurrencyOptionModel.findOne({ currency }).lean();
    } else {
      const ipInfo = await lookupIPInfo(req, null);
      const query = ipInfo?.data
        ? { countries: { $in: [ipInfo.data.countryCode] } }
        : { isDefault: true };
      currencyInfo = await CurrencyOptionModel.findOne(query).lean();
    }

    if (!currencyInfo)
      currencyInfo = await CurrencyOptionModel.findOne({
        isDefault: true,
      }).lean();

    setCookie(res, "currencyInfo", currencyInfo, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, 200, "Currency retrieved", { currencyInfo });
  } catch (error) {
    handleError(res, "Error retrieving currency info.", error);
  }
};
