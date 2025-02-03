import envConfig from "@/config/env";
import { CookieOptions, Request, Response } from "express";
import { generateTokens, ITokenPayload, manageTokensCookies } from "./jwt";
import { IUser } from "@/models/user";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import logger from "@/config/logger";
import ms from "ms";
import { ILookupIPInfo } from "@/types/global";

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

export const setCookie = (
  res: Response,
  key: string,
  value: any,
  options?: CookieOptions
) => {
  res.cookie(key, typeof value === "string" ? value : JSON.stringify(value), {
    httpOnly: true,
    secure: envConfig.env === "production",
    sameSite: "strict",
    path: "/",
    ...options,
  });
};

export const getCookie = <T>(req: Request, key: string): T | null => {
  const cookie = req.cookies[key];
  if (!cookie) {
    return null;
  }
  try {
    return JSON.parse(cookie) as T;
  } catch (error) {
    logger.error(`Error parsing cookie for key ${key}:`, error);
    return null;
  }
};

export const clearCookie = (
  res: Response,
  key: string,
  options?: CookieOptions
) => {
  res.clearCookie(key, options);
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

    return { data, fallback };
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

  return {
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

export const getExchangeRates = async (
  currency = "USD",
  fallback: number
): Promise<number> => {
  try {
    const { data } = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${currency}`
    );
    const rate = data.rates[currency] || fallback;
    return rate;
  } catch (error) {
    logger.error("Error fetching exchange rates:", error);
    return fallback;
  }
};
