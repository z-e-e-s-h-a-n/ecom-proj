import jwt, { JwtPayload } from "jsonwebtoken";
import { durationToTime, getEnv, manageCookies } from "@/utils/helper";
import { Request, Response } from "express";
import RefreshTokenModel from "@/models/refreshToken";
import envConfig from "@/config/envConfig";
import mongoose from "mongoose";
import logger from "@/utils/logger";

export interface IJwtTokens {
  refreshToken: string;
  accessToken: string;
  refreshExp: number;
  accessExp: number;
}

export interface ITokenPayload {
  id: string | mongoose.Types.ObjectId;
  role: string;
}

export const generateTokens = async ({
  id,
  role,
}: ITokenPayload): Promise<IJwtTokens> => {
  if (!id || !role) {
    console.log(`id: ${id}, role: ${role}`);
    throw new Error("Missing required Parameters.");
  }
  const payload: JwtPayload = { id: id.toString(), role };

  const accessExp = durationToTime("15m", true);
  const refreshExp = durationToTime("7d", true);

  const accessToken = jwt.sign(
    { ...payload, exp: accessExp },
    envConfig.jwt.accessSecret
  );
  const refreshToken = jwt.sign(
    { ...payload, exp: refreshExp },
    envConfig.jwt.refreshSecret
  );

  await RefreshTokenModel.updateOne(
    { userId: id },
    { token: refreshToken, blacklisted: false },
    { upsert: true }
  );

  return { accessToken, refreshToken, accessExp, refreshExp };
};

export const verifyJwtToken = (
  token: string,
  secretType: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET"
): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, getEnv(secretType)) as JwtPayload;
    if ((decoded.exp ?? 0) < Date.now() / 1000) {
      logger.warn("Token has expired", { token });
      return null;
    }
    return decoded;
  } catch (error) {
    logger.error("Error verifying token", { error });
    return null;
  }
};

export const attachDecodedUser = (req: Request, decoded: JwtPayload) => {
  req.user = { ...decoded, isAuth: true };
};

export const handleTokenRefresh = async (req: Request, res: Response) => {
  const tokenData = await refreshAccessToken(req);
  manageTokensCookies(res, "add", tokenData);
  logger.info("New tokens added");

  const decoded = verifyJwtToken(tokenData.accessToken, "JWT_ACCESS_SECRET");
  if (!decoded) throw new Error("Failed to decode new access token");

  return attachDecodedUser;
};

export const refreshAccessToken = async (req: Request): Promise<IJwtTokens> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new Error("Refresh Token is missing");

  const tokenRecord = await RefreshTokenModel.findOne({
    token: refreshToken,
    blacklisted: false,
  });
  if (!tokenRecord)
    throw new Error("Invalid, blacklisted, or expired refresh token");

  const decoded = verifyJwtToken(refreshToken, "JWT_REFRESH_SECRET");
  if (!decoded) throw new Error("Invalid or expired refresh token");

  return generateTokens(decoded as ITokenPayload);
};

export const manageTokensCookies = (
  res: Response,
  action: "add" | "remove",
  tokenData?: IJwtTokens
): void => {
  const tokens = [
    {
      name: "accessToken",
      value: tokenData?.accessToken,
      exp: tokenData?.accessExp,
    },
    {
      name: "refreshToken",
      value: tokenData?.refreshToken,
      exp: tokenData?.refreshExp,
    },
  ];

  tokens.forEach(({ name, value, exp }) => {
    if (action === "add" && value && exp) {
      manageCookies(res, action, { name, secret: value }, { maxAge: exp });
    } else if (action === "remove") {
      res.clearCookie(name);
    }
  });
};
