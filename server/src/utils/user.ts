import { Request, Response } from "express";
import otpModel from "@/models/otp";
import sendEmail from "@/config/nodemailer";
import { ObjectId } from "@/types/global";
import logger from "./logger";
import { createAuthSession, sendResponse } from "./helper";
import { IUser, ISafeUser } from "@/models/user";

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
  const otpDocument = new otpModel({ userId, purpose });
  const otp = otpDocument.generateOtp();
  await otpDocument.save();

  const verifyLink = `${process.env.APP_ENDPOINT}/auth/verify-otp?otp=${otp}&email=${email}`;
  const emailContent = `<h1>${subject}</h1>
    <p>Your Otp Code is: <b>${otp}</b></p>
    <p>${message}</p>
    <a href="${verifyLink}">${verifyLink}</a>`;

  await sendEmail(email, subject, emailContent);
  return { status: 200, message: "OTP sent successfully." };
};

export const verifyOtp = async ({ userId, otp, purpose }: verifyOtpPayload) => {
  const otpRecord = await otpModel.findOne({ userId, purpose });
  if (!otpRecord || !otpRecord.verifyOtp(otp)) {
    logger.alert("Invalid or expired OTP.");
    throw new Error("Invalid or expired OTP.");
  }
  await otpModel.deleteOne({ _id: otpRecord._id });
  return { status: 200, message: "OTP verified successfully." };
};

export const formatUserResponse = (
  user: IUser,
  additionalInfo: Record<string, any> = {}
): ISafeUser & Record<string, any> => {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isAuth: true,
    isVerified: user.isVerified,
    ...additionalInfo,
  };
};

export const prepareUserResponse = async (
  req: Request,
  res: Response,
  user: IUser,
  message: string
) => {
  try {
    const tokenData = await createAuthSession(req, res, user);
    const userResponse = formatUserResponse(user);

    sendResponse(res, 200, true, message, { user: userResponse, ...tokenData });
  } catch (error) {
    sendResponse(res, 500, false, "Error processing user response.");
  }
};
