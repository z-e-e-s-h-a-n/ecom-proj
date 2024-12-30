import logger from "@/utils/logger";
import UserModel from "@/models/user";
import { Request, Response } from "express";
import { manageTokensCookies } from "@/utils/jwt";
import RefreshTokenModel from "@/models/refreshToken";
import { prepareUserResponse, sendOtp, verifyOtp } from "@/utils/user";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }
    if (await UserModel.exists({ email })) {
      res.status(400).json({ message: "Email is already registered." });
      return;
    }
    const newUser = await UserModel.create({ name, email, password });
    await sendOtp({
      userId: newUser._id,
      email,
      purpose: "email_verification",
      subject: "Verify Your Email",
      message: "Click the link below to verify your email.",
    });
    res.status(201).json({ message: "User registered. Verify email." });
  } catch (error) {
    logger.error("Signup Error: ", { error });
    res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { otp, email } = req.query;
    if (!otp || !email) {
      res.status(400).json({ message: "OTP and Email are required." });
      return;
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified." });
      return;
    }

    await verifyOtp({
      userId: user._id,
      otp: otp as string,
      purpose: "email_verification",
    });

    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    logger.error("Email Verification Error:", { error });
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (!(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: "Please verify your email first." });
      return;
    }

    await prepareUserResponse(res, user, "Login successful.");
  } catch (error) {
    logger.error("Error during login", { error });
    res.status(500).json({ message: "Internal server error during login." });
  }
};

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      res.status(400).json({ message: "Email and purpose are required." });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    switch (purpose) {
      case "email_verification":
        if (user.isVerified) {
          res.status(400).json({ message: "Email is already verified." });
          return;
        }
        await sendOtp({
          userId: user._id,
          email,
          purpose: "email_verification",
          subject: "Verify Your Email",
          message: "Click the link below to verify your email.",
        });
        res.status(200).json({ message: "Verification email sent." });
        return;

      case "password_reset":
        await sendOtp({
          userId: user._id,
          email,
          purpose: "password_reset",
          subject: "Reset Your Password",
          message: "Click the link below to reset your password.",
        });
        res.status(200).json({ message: "Password reset email sent." });
        return;

      default:
        res.status(400).json({ message: "Invalid purpose." });
        return;
    }
  } catch (error) {
    logger.error("Error in requestSendEmail:", { error });
    res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshTokenModel.findOneAndUpdate(
        { token: refreshToken },
        { $set: { blacklisted: true } }
      );
    }
    manageTokensCookies(res, "remove");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    logger.error("Error during logout", { error });
    res.status(500).json({ message: "Internal server error during logout." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await verifyOtp({
      userId: user._id,
      otp,
      purpose: "password_reset",
    });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    logger.error("Error resetting password:", { error });
    res.status(500).json({ message: "Internal server error." });
  }
};
