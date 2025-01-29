import jwt, { JwtPayload } from "jsonwebtoken";
import {
  getEnv,
  addCookies,
  durationToTime,
  createAuthSession,
  getDeviceInfo,
  calculateExpiryTime,
} from "@/utils/helper";
import { Request, Response } from "express";
import RefreshTokenModel from "@/models/refreshToken";
import envConfig from "@/config/envConfig";
import mongoose from "mongoose";
import logger from "@/utils/logger";
import { ISafeUser } from "@/models/user";

export interface IJwtTokens {
  refreshToken: string;
  accessToken: string;
  refreshExp: number;
  accessExp: number;
  deviceId: string;
}

export interface ITokenPayload {
  _id: string | mongoose.Types.ObjectId;
  role: string;
}

export const generateTokens = async (
  req: Request,
  { _id, role }: ITokenPayload
): Promise<IJwtTokens> => {
  if (!_id || !role) {
    throw new Error("Missing required parameters");
  }

  const payload: JwtPayload = { _id: _id.toString(), role };
  const accessExp = durationToTime("15m");
  const refreshExp = durationToTime("7d");

  const accessToken = jwt.sign(payload, envConfig.jwt.accessSecret, {
    expiresIn: accessExp,
  });

  const refreshToken = jwt.sign(payload, envConfig.jwt.refreshSecret, {
    expiresIn: refreshExp,
  });

  const deviceInfo = await getDeviceInfo(req);
  logger.info("Generated new tokens", { userId: _id });

  await RefreshTokenModel.updateOne(
    { userId: _id, "deviceInfo.id": deviceInfo.id },
    {
      token: refreshToken,
      deviceInfo,
      expiresAt: calculateExpiryTime(refreshExp, true),
      blacklisted: false,
      isActive: true,
    },
    { upsert: true }
  );

  return {
    accessToken,
    refreshToken,
    accessExp,
    refreshExp,
    deviceId: deviceInfo.id,
  };
};

export const verifyJwtToken = (
  token: string,
  secretType: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET"
): JwtPayload | null => {
  try {
    return jwt.verify(token, getEnv(secretType)) as JwtPayload;
  } catch (error) {
    logger.error("Error verifying token", { error });
    return null;
  }
};

export const attachDecodedUser = (req: Request, decoded: JwtPayload): void => {
  if (decoded) {
    req.user = decoded as ISafeUser;
    logger.info("User attached to request", { user: req.user });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<IJwtTokens> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new Error("Refresh token is missing.");
  }

  const tokenRecord = await RefreshTokenModel.findOne({
    token: refreshToken,
    blacklisted: false,
  });

  if (!tokenRecord) {
    logger.warn("Invalid or blacklisted refresh token.");
    throw new Error("Invalid or expired refresh token.");
  }

  const decoded = verifyJwtToken(refreshToken, "JWT_REFRESH_SECRET");

  if (!decoded) {
    await RefreshTokenModel.updateOne(
      { token: refreshToken },
      { blacklisted: true }
    );
    logger.warn("Refresh token is invalid, blacklisted, or expired.");
    throw new Error("Invalid refresh token.");
  }

  logger.info("Refresh token successfully verified", { userId: decoded._id });
  return createAuthSession(req, res, decoded as ITokenPayload);
};

export const handleTokenRefresh = async (req: Request, res: Response) => {
  const tokenData = await refreshAccessToken(req, res);

  logger.info("New tokens issued for the user", { userId: req.cookies.userId });

  const decoded = verifyJwtToken(tokenData.accessToken, "JWT_ACCESS_SECRET");
  if (!decoded) throw new Error("Failed to decode new access token.");

  attachDecodedUser(req, decoded);
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
    {
      name: "deviceId",
      value: tokenData?.deviceId,
      exp: tokenData?.refreshExp,
    },
  ];

  tokens.forEach(({ name, value, exp }) => {
    if (action === "add" && value && exp) {
      addCookies(res, name, value, { maxAge: exp * 1000 });
    } else if (action === "remove") {
      res.clearCookie(name);
    }
  });
};
