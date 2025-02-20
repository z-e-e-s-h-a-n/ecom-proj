import logger from "@/config/logger";
import UserModel from "@/models/user";
import { Request, Response } from "express";
import { manageTokensCookies } from "@/lib/utils/jwt";
import RefreshTokenModel from "@/models/refreshToken";
import {
  formatUserResponse,
  getQueryParams,
  prepareUserResponse,
} from "@/lib/utils/helper";
import { sendOtp, verifyOtp } from "@/lib/actions/user";
import { parseIdentifier, sendResponse, handleError } from "@/lib/utils/helper";
import { OtpPurpose } from "@/models/otpSession";

export const signup = async (req: Request, res: Response) => {
  try {
    logger.info("req.body", { body: req.body });

    const { firstName, lastName, identifier, password } = req.body;
    if (!firstName || !identifier)
      return sendResponse(res, 400, "Missing required fields.");

    const { email, phone, query, key } = parseIdentifier(identifier);

    const existingUser = await UserModel.findOne(query);
    if (existingUser) return sendResponse(res, 409, "User already exists.");

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    await prepareUserResponse(
      req,
      res,
      newUser,
      201,
      `User Registered, please verify your ${key}`
    );
  } catch (error) {
    handleError(res, "Error signing up", error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return sendResponse(res, 400, "Missing required fields.");

    const { query, email, phone, key } = parseIdentifier(identifier);

    const user = await UserModel.findOne(query);
    if (!user) return sendResponse(res, 404, "User not found.");

    if (!user.password)
      return sendResponse(res, 400, "Please Set Your Password First");

    if (!(await user.comparePassword(password)))
      return sendResponse(res, 401, "Invalid email or password.");

    if (!user.isAuth) {
      await sendOtp({ userId: user._id, email, phone, purpose: "verifyEmail" });
      return sendResponse(res, 401, "Please verify your email first.", {
        user: formatUserResponse(user),
      });
    }

    await prepareUserResponse(
      req,
      res,
      user,
      user.isAuth ? 200 : 400,
      user.isAuth ? "Signin Successful" : `please verify your ${key}`
    );
  } catch (error) {
    handleError(res, "Error logging in", error);
  }
};

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { identifier, purpose } = req.body;
    if (!identifier || !purpose)
      return sendResponse(res, 400, "Missing required fields.");
    const { email, phone, query } = parseIdentifier(identifier);

    const user = await UserModel.findOne(query);
    if (!user) return sendResponse(res, 404, "User not found.");

    // Handle specific purposes
    if (purpose === "verifyEmail") {
      if (user.isAuth)
        return sendResponse(res, 400, "Email is already verified.");

      await sendOtp({ userId: user._id, email, phone, purpose });
      return sendResponse(res, 200, "Verification OTP sent.");
    }

    if (["setPassword", "resetPassword"].includes(purpose)) {
      await sendOtp({ userId: user._id, email, phone, purpose });
      return sendResponse(res, 200, "Password reset OTP sent.");
    }

    sendResponse(res, 400, "Invalid purpose.");
  } catch (error) {
    handleError(res, "Error requesting OTP", error);
  }
};

export const validateOtp = async (req: Request, res: Response) => {
  try {
    let { identifier, secret, purpose, verifyOnly } = getQueryParams(req.query);

    if (!identifier || !secret || !purpose)
      return sendResponse(res, 400, "Missing required fields.");
    const { query, email, phone } = parseIdentifier(identifier);

    const user = await UserModel.findOne(query);
    if (!user) return sendResponse(res, 404, "User not found.");

    const session = await verifyOtp({
      userId: user._id,
      secret,
      purpose: purpose as OtpPurpose,
      verifyOnly: verifyOnly === "true",
    });

    if (verifyOnly === "true" && session)
      return sendResponse(res, 200, "Otp Successfully Verified", {
        secret: session.secret,
      });

    if (purpose === "verifyEmail") {
      if (user.isAuth)
        return sendResponse(res, 400, "Email is already verified.");

      user.isAuth = true;
      await user.save();

      return sendResponse(res, 200, "Email verified successfully.", {
        user: formatUserResponse(user),
      });
    }

    if (["setPassword", "resetPassword"].includes(purpose)) {
      const session = await sendOtp({
        userId: user._id,
        email,
        phone,
        purpose: purpose as OtpPurpose,
        type: "token",
        sendSecret: false,
      });

      return sendResponse(res, 200, "OTP verified Add New Password.", {
        secret: session.secret,
      });
    }

    sendResponse(res, 400, "Invalid purpose.");
  } catch (error: any) {
    handleError(res, "Error validating OTP", error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const tokenId = req.cookies.tokenId;

    if (!refreshToken || !tokenId) {
      logger.warn("Logout attempted without refreshToken or deviceId.");
      manageTokensCookies(res, "remove");
      return sendResponse(res, 200, "Logged out (no active session).");
    }

    const result = await RefreshTokenModel.findOneAndUpdate(
      { token: refreshToken, _id: tokenId },
      { $set: { blacklisted: true } }
    );

    if (!result) logger.warn("No matching refreshToken found for logout.");

    manageTokensCookies(res, "remove");
    sendResponse(res, 200, "Logged out successfully.");
  } catch (error) {
    handleError(res, "Error during logout", error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, password, secret, purpose } = req.body;
    if (!secret || !identifier || !password || !purpose)
      return sendResponse(res, 400, "Missing Fields are required.");

    if (!["setPassword", "resetPassword"].includes(purpose))
      return sendResponse(res, 400, "Invalid purpose.");

    const { query } = parseIdentifier(identifier);
    const user = await UserModel.findOne(query);
    if (!user) return sendResponse(res, 404, "User not found.");
    await verifyOtp({ userId: user._id, secret, purpose });

    user.password = password;
    await user.save();

    sendResponse(res, 200, "Password reset successful.");
  } catch (error) {
    handleError(res, "Error resetting password", error);
  }
};
