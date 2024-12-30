import envConfig from "@/config/envConfig";
import { CookieOptions, Response } from "express";

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

export const manageCookies = (
  res: Response,
  action: "add" | "remove",
  details: { name: string; secret: string },
  options: CookieOptions
) => {
  const { name, secret } = details;

  if (action === "add" && secret) {
    res.cookie(name, secret, {
      httpOnly: true,
      secure: envConfig.env === "production",
      sameSite: "strict",
      ...options,
    });
  } else if (action === "remove") {
    res.clearCookie(name);
  }
};
