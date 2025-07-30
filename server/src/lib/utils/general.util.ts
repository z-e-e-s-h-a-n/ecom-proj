import type { OtpType } from "@prisma/client";
import crypto from "crypto";
import ms, { type StringValue } from "ms";

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

export const parseExpiry = (exp: string, future = false): number => {
  const val = ms(exp as StringValue);
  if (future) return Date.now() + val;
  return val;
};

export const expiryDate = (exp: string, future = false): Date => {
  const val = parseExpiry(exp, future);
  return new Date(val);
};

export const generateSecret = (type: OtpType, prefix = ""): string => {
  switch (type) {
    case "token":
      return `${prefix}${crypto.randomBytes(32).toString("hex")}`;
    case "otp":
      return crypto.randomInt(100000, 999999).toString();
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};
