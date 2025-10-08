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

export const generateReferralCode = (name: string): string => {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `${prefix}${randomPart}`;
};
