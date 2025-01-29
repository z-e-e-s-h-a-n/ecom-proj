import logger from "@/utils/logger";
import UserModel from "@/models/user";
import { Request, Response } from "express";
import { manageTokensCookies } from "@/utils/jwt";
import RefreshTokenModel from "@/models/refreshToken";
import {
  formatUserResponse,
  prepareUserResponse,
  sendOtp,
  verifyOtp,
} from "@/utils/user";
import { sendResponse } from "@/utils/helper";
import TempSessionModel from "@/models/tempSession";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "Missing required fields.");
    }
    if (await UserModel.exists({ email })) {
      return sendResponse(res, 400, false, "Email is already registered.");
    }
    const newUser = await UserModel.create({ name, email, password });
    await sendOtp({
      userId: newUser._id,
      email,
      purpose: "email_verification",
      subject: "Verify Your Email",
      message: "Click the link below to verify your email.",
    });

    sendResponse(res, 201, true, "User registered. Verify email.");
  } catch (error) {
    logger.error("Signup Error: ", { error });
    sendResponse(res, 500, false, "Internal server error.");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, false, "Missing required fields.");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    if (!(await user.comparePassword(password))) {
      return sendResponse(res, 401, false, "Invalid email or password.");
    }

    if (!user.isVerified) {
      return sendResponse(res, 401, false, "Please verify your email first.", {
        user: formatUserResponse(user),
      });
    }

    await prepareUserResponse(req, res, user, "Login successful.");
  } catch (error) {
    logger.error("Error during login", { error });
    sendResponse(res, 500, false, "Internal server error during login.");
  }
};

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return sendResponse(res, 400, false, "Email and purpose are required.");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    // Handle specific purposes
    if (purpose === "email_verification") {
      if (user.isVerified) {
        return sendResponse(res, 400, false, "Email is already verified.");
      }

      await sendOtp({
        userId: user._id,
        email,
        purpose: "email_verification",
        subject: "Verify Your Email",
        message: "Click the link below to verify your email.",
      });
      return sendResponse(res, 200, true, "Verification email sent.");
    }

    if (purpose === "password_reset") {
      await sendOtp({
        userId: user._id,
        email,
        purpose: "password_reset",
        subject: "Reset Your Password",
        message: "Click the link below to reset your password.",
      });
      return sendResponse(res, 200, true, "Password reset email sent.");
    }

    // Invalid purpose
    sendResponse(res, 400, false, "Invalid purpose.");
  } catch (error) {
    logger.error("Error in requestOtp:", { error });
    sendResponse(res, 500, false, "Internal server error.");
  }
};

export const validateOtp = async (req: Request, res: Response) => {
  try {
    const { otp, email, purpose } = req.body;

    if (!otp || !email || !purpose) {
      return sendResponse(
        res,
        400,
        false,
        "OTP, email, and purpose are required."
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    // Verify the OTP
    await verifyOtp({ userId: user._id, otp, purpose });

    // Handle specific purposes
    if (purpose === "email_verification") {
      if (user.isVerified) {
        return sendResponse(res, 400, false, "Email is already verified.");
      }

      user.isVerified = true;
      await user.save();

      return sendResponse(res, 200, true, "Email verified successfully.", {
        user: formatUserResponse(user),
      });
    }

    if (purpose === "password_reset") {
      const session = new TempSessionModel({
        userId: user._id,
        purpose: "password_reset",
      });

      const token = session.generateToken();
      await session.save();

      return sendResponse(res, 200, true, "OTP verified for password reset.", {
        token,
      });
    }

    sendResponse(res, 400, false, "Invalid purpose.");
  } catch (error) {
    logger.error("OTP Verification Error:", { error });
    sendResponse(res, 500, false, "Internal server error.");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.cookies.deviceId;

    if (!refreshToken || !deviceId) {
      logger.warn("Logout attempted without refreshToken or deviceId.");
      manageTokensCookies(res, "remove");
      return sendResponse(res, 200, true, "Logged out (no active session).");
    }

    const result = await RefreshTokenModel.findOneAndUpdate(
      { token: refreshToken, "deviceInfo.id": deviceId },
      { $set: { blacklisted: true } }
    );

    if (!result) {
      logger.warn("No matching refreshToken found for logout.");
    }

    manageTokensCookies(res, "remove");
    sendResponse(res, 200, true, "Logged out successfully.");
  } catch (error) {
    logger.error("Error during logout", { error });
    sendResponse(res, 500, false, "Internal server error during logout.");
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendResponse(res, 400, false, "Missing Fields are required.");
    }

    const session = await TempSessionModel.findOne({ token });
    if (!session || !session.verifyToken(token)) {
      return sendResponse(res, 401, false, "Invalid or expired session token.");
    }

    const user = await UserModel.findById(session.userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    // Reset the password
    user.password = newPassword;
    await user.save();
    await session.deleteOne();

    sendResponse(res, 200, true, "Password reset successful.");
  } catch (error) {
    logger.error("Error resetting password:", { error });
    sendResponse(res, 500, false, "Internal server error ");
  }
};
