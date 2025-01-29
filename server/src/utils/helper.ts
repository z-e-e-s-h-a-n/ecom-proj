import envConfig from "@/config/envConfig";
import { CookieOptions, Request, Response } from "express";
import { generateTokens, ITokenPayload, manageTokensCookies } from "./jwt";
import { IUser } from "@/models/user";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import logger from "@/utils/logger";
import ms from "ms";

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

const getClientIp = (req: Request): string => {
  return (
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ??
    (req.ip || "unknown_ip")
  );
};

export const lookupIPLocation = async (ip: string): Promise<string> => {
  try {
    if (ip === "::1" || ip === "127.0.0.1") {
      return "Localhost (Development)";
    }

    const response = await axios.get(
      `http://api.ipstack.com/${ip}?access_key=${envConfig.ipStack.apiKey}`
    );

    if (response.data?.city && response.data?.country_name) {
      return `${response.data.city}, ${response.data.country_name}`;
    }

    return "Unknown location";
  } catch (error) {
    logger.error("Failed to resolve IP location:", error);
    return "Unknown location";
  }
};

// Modify getDeviceInfo to include generated ID
export const getDeviceInfo = async (req: Request) => {
  const ip = getClientIp(req) || "unknown_ip";
  const location = await lookupIPLocation(ip);
  const ua = req.headers["user-agent"] || "Unknown User-Agent";

  const parser = new UAParser(ua);
  const os = parser.getOS().name || "Unknown OS";
  const browser = parser.getBrowser().name || "Unknown Browser";

  const existingDeviceId = req.cookies.deviceId;
  const deviceId = existingDeviceId || crypto.randomUUID();

  return {
    id: deviceId,
    name: `${browser} on ${os}`,
    ip,
    location,
    lastUsed: new Date(),
    userAgent: ua,
    os,
    browser,
  };
};
