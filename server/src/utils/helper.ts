import envConfig from "@/config/envConfig";
import { CookieOptions, Request, Response } from "express";
import { generateTokens, ITokenPayload, manageTokensCookies } from "./jwt";
import { IUser } from "@/models/user";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import logger from "@/config/logger";
import ms from "ms";
import { type ILookupIPInfo } from "@/types/global";
import { IProduct } from "@/models/product";
import CurrencyOptionModel from "@/models/currency";
import getSymbolFromCurrency from "currency-symbol-map";

export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && !fallback)
    throw new Error(`Missing environment variable: ${key}`);
  return value || fallback!;
};

export const durationToTime = (
  duration: ms.StringValue,
  asMs = false
): number => {
  const durationMs = ms(duration);

  if (asMs) {
    return durationMs;
  }
  return Math.floor(durationMs / 1000);
};

export const calculateExpiryTime = (time: number, isInSec = true): Date => {
  const currentTime = Date.now();
  return new Date(currentTime + (isInSec ? time * 1000 : time));
};

export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data = {}
) => {
  res.status(status).json({ success, message, data });
};

export const addCookies = (
  res: Response,
  name: string,
  secret: string,
  options?: CookieOptions
) => {
  res.cookie(name, secret, {
    httpOnly: true,
    secure: envConfig.env === "production",
    sameSite: "strict",
    path: "/",
    ...options,
  });
};

export const createAuthSession = async (
  req: Request,
  res: Response,
  user: IUser | ITokenPayload
) => {
  const tokenData = await generateTokens(req, user as ITokenPayload);
  manageTokensCookies(res, "add", tokenData);
  return tokenData;
};

export const lookupIPInfo = async <T>(
  req: Request,
  fallback: T
): Promise<ILookupIPInfo<T>> => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ??
      req.ip;

    if (!ip || ip === "::1" || ip === "127.0.0.1") return { fallback };

    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    const symbol =
      getSymbolFromCurrency(data.currency) || (fallback as any)?.symbol;
    return { data: { ...data, symbol }, fallback };
  } catch (error) {
    logger.error("Failed to resolve IP location:", error);
    return { fallback };
  }
};

export const getDeviceInfo = async (req: Request) => {
  const ipInfo = await lookupIPInfo(req, "Unknown location");
  const ua = req.headers["user-agent"] || "Unknown User-Agent";

  const parser = new UAParser(ua);
  const os = parser.getOS().name || "Unknown OS";
  const browser = parser.getBrowser().name || "Unknown Browser";

  const existingDeviceId = req.cookies.deviceId;
  const deviceId = existingDeviceId || crypto.randomUUID();

  return {
    id: deviceId,
    name: `${browser} on ${os}`,
    ip: ipInfo.data ? ipInfo.data.query : ipInfo.fallback,
    location: ipInfo.data
      ? `${ipInfo.data.city}, ${ipInfo.data.country}`
      : ipInfo.fallback,
    lastUsed: new Date(),
    userAgent: ua,
    os,
    browser,
  };
};

export const findAndPopulate = async (
  model: any,
  query: object,
  populateFields: string | string[] = ["items.productId"]
) => {
  const fields = Array.isArray(populateFields)
    ? populateFields
    : [populateFields];
  let queryBuilder = model.findOne(query);
  fields.forEach((field) => {
    queryBuilder = queryBuilder.populate(field);
  });
  return queryBuilder;
};

const exchangeRateCache = new Map<string, number>();

export const getExchangeRates = async (
  currency = "USD",
  fallback: number
): Promise<number> => {
  if (exchangeRateCache.has(currency))
    return exchangeRateCache.get(currency) || fallback;

  try {
    const { data } = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${currency}`
    );
    const rate = data.rates[currency] || fallback;
    exchangeRateCache.set(currency, rate);
    return rate;
  } catch (error) {
    logger.error("Error fetching exchange rates:", error);
    return fallback;
  }
};

export const formatProductPricing = async (req: Request, product: IProduct) => {
  try {
    const defaultCurrency = (await CurrencyOptionModel.findOne({
      isDefault: true,
    }).lean()) || { currency: "USD", symbol: "$", countryCode: "US" };

    const ipInfo = await lookupIPInfo(req, defaultCurrency);
    const { countryCode } = ipInfo.data ?? ipInfo.fallback;

    let currencyOption: any = await CurrencyOptionModel.findOne({
      countryCode,
    }).lean();

    if (!currencyOption) {
      const currency = ipInfo.data?.currency ?? ipInfo.fallback.currency;
      const symbol = ipInfo.data?.symbol ?? ipInfo.fallback.currency;
      const multiplier = await getExchangeRates(currency, 1);
      currencyOption = { currency, symbol, multiplier };
    }

    const { multiplier, currency, symbol } = currencyOption;

    return product.variations.map((variation) => {
      const pricing = variation.pricing.find(
        (p) => p.countryCode === countryCode
      );
      if (pricing) return { ...variation, pricing };

      const fallbackPricing = variation.pricing.find(
        (p) => p.currency === "USD"
      );
      if (!fallbackPricing) {
        logger.warn(`No fallback USD pricing for variation: ${variation.sku}`);
        return { ...variation, pricing: {} };
      }

      return {
        ...variation,
        pricing: {
          countryCode,
          currency,
          symbol,
          original: fallbackPricing.original * multiplier,
          sale: fallbackPricing.sale
            ? fallbackPricing.sale * multiplier
            : undefined,
        },
      };
    });
  } catch (error) {
    logger.error("Error formatting pricing:", error);
    return product.variations.map((variation) => ({
      ...variation,
      pricing: {},
    }));
  }
};
