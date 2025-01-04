import envConfig from "@/config/envConfig";
import { CookieOptions, Response } from "express";
import { generateTokens, ITokenPayload, manageTokensCookies } from "./jwt";
import { IUser } from "@/models/user";

export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && !fallback)
    throw new Error(`Missing environment variable: ${key}`);
  return value || fallback!;
};

export const durationToTime = (duration: string, asMs = false): number => {
  const timeUnits: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  const match = duration.match(/^(\d+)([smhd])$/);

  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const timeInSeconds = value * (timeUnits[unit] || 1);

  return asMs ? timeInSeconds * 1000 : timeInSeconds;
};

export const calculateExpiryTime = (duration: string, asMs = false): number => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const durationInSeconds = durationToTime(duration, asMs);
  return currentTimeInSeconds + durationInSeconds;
};

export const calculateExpiresIn = (duration: string): number => {
  const durationInSeconds = durationToTime(duration);
  return durationInSeconds;
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
  res: Response,
  user: IUser | ITokenPayload
) => {
  const tokenData = await generateTokens(user as ITokenPayload);
  manageTokensCookies(res, "add", tokenData);
  return tokenData;
};
