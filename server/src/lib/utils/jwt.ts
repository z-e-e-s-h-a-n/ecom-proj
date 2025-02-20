import jwt, { JwtPayload } from "jsonwebtoken";
import {
  getEnv,
  setCookie,
  durationToTime,
  createAuthSession,
  getDeviceInfo,
  calculateExpiryTime,
} from "@/lib/utils/helper";
import { Request, Response } from "express";
import RefreshTokenModel from "@/models/refreshToken";
import envConfig from "@/config/env";
import mongoose from "mongoose";
import logger from "@/config/logger";
import { ISafeUser, UserRole } from "@/models/user";

export interface IJwtTokens {
  refreshToken: string;
  accessToken: string;
  refreshExp: number;
  accessExp: number;
  tokenId: string;
}

export interface ITokenPayload {
  _id: string | mongoose.Types.ObjectId;
  role: UserRole;
  isAuth: boolean;
}

export const generateTokens = async (
  req: Request,
  { _id, role, isAuth }: ITokenPayload
): Promise<IJwtTokens> => {
  if (!_id || !role) {
    throw new Error("Missing required parameters");
  }

  const payload: JwtPayload = { _id: _id.toString(), role, isAuth };
  const accessExp = "15m";
  const refreshExp = "7d";

  const accessToken = jwt.sign(payload, envConfig.jwt.accessSecret, {
    expiresIn: accessExp,
  });

  const refreshToken = jwt.sign(payload, envConfig.jwt.refreshSecret, {
    expiresIn: refreshExp,
  });

  const deviceInfo = await getDeviceInfo(req);
  const tokenId = req.cookies.tokenId || new mongoose.Types.ObjectId();

  const newToken = await RefreshTokenModel.findOneAndUpdate(
    { userId: _id, _id: tokenId },
    {
      token: refreshToken,
      deviceInfo,
      expiresAt: calculateExpiryTime(durationToTime(refreshExp), true),
      blacklisted: false,
      isActive: true,
    },
    { new: true, upsert: true }
  );

  return {
    accessToken,
    refreshToken,
    accessExp: durationToTime(accessExp, true),
    refreshExp: durationToTime(refreshExp, true),
    tokenId: newToken._id.toString(),
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
  if (decoded) req.user = decoded as ISafeUser;
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

  return createAuthSession(req, res, decoded as ITokenPayload);
};

export const handleTokenRefresh = async (req: Request, res: Response) => {
  const tokenData = await refreshAccessToken(req, res);

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
      maxAge: tokenData?.accessExp,
    },
    {
      name: "refreshToken",
      value: tokenData?.refreshToken,
      maxAge: tokenData?.refreshExp,
    },
    {
      name: "tokenId",
      value: tokenData?.tokenId,
      maxAge: tokenData?.refreshExp,
    },
  ];

  tokens.forEach(({ name, value, maxAge }) => {
    if (action === "add" && value && maxAge) {
      setCookie(res, name, value, { maxAge });
    } else if (action === "remove") {
      res.clearCookie(name);
    }
  });
};
