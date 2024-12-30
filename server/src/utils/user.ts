import { generateTokens, manageTokensCookies } from "@/utils/jwt";
import { Response } from "express";
import OtpVerificationModel from "@/models/otpVerification";
import sendEmail from "@/config/nodemailer";
import { ObjectId } from "@/types/global";
import logger from "./logger";

export interface SendOtpPayload {
  userId: string | ObjectId;
  email: string;
  purpose: string;
  subject: string;
  message: string;
}

export interface verifyOtpPayload {
  userId: string | ObjectId;
  otp: string;
  purpose: string;
}

export const sendOtp = async ({
  userId,
  email,
  purpose,
  subject,
  message,
}: SendOtpPayload) => {
  const otpDocument = new OtpVerificationModel({ userId, purpose });
  const otp = otpDocument.generateOtp();
  await otpDocument.save();

  const verifyLink = `${process.env.APP_ENDPOINT}/auth/verify-otp?otp=${otp}&email=${email}`;
  const emailContent = `<h1>${subject}</h1>
    <p>${message}</p>
    <a href="${verifyLink}">${verifyLink}</a>`;

  await sendEmail(email, subject, emailContent);
  return { status: 200, message: "OTP sent successfully." };
};

export const verifyOtp = async ({ userId, otp, purpose }: verifyOtpPayload) => {
  const otpRecord = await OtpVerificationModel.findOne({ userId, purpose });
  if (!otpRecord || !otpRecord.verifyOtp(otp)) {
    logger.alert("Invalid or expired OTP.");
    throw new Error("Invalid or expired OTP.");
  }
  await OtpVerificationModel.deleteOne({ _id: otpRecord._id });
  return { status: 200, message: "OTP verified successfully." };
};

export const prepareUserResponse = async (
  res: Response,
  user: any,
  message: string
) => {
  try {
    const tokenData = await generateTokens({ id: user._id, role: user.role });
    manageTokensCookies(res, "add", tokenData);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAuth: true,
    };

    res.status(200).json({
      message,
      user: userResponse,
      ...tokenData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing user response." });
  }
};
