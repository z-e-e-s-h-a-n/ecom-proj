import OtpSessionModel, { OtpPurpose, OtpType } from "@/models/otpSession";
import { sendEmail } from "@/config/nodemailer";
import { sendSms } from "@/config/twilio";
import { Nullable } from "@/types/global";
import { Types } from "mongoose";

export interface SendOtpPayload {
  userId: Types.ObjectId;
  email?: Nullable<string>;
  phone?: Nullable<string>;
  purpose: OtpPurpose;
  sendSecret?: boolean;
  type?: OtpType;
}

export interface verifyOtpPayload {
  userId: Types.ObjectId;
  secret: string;
  purpose: OtpPurpose;
  verifyOnly?: boolean;
  type?: OtpType;
}

export const sendOtp = async ({
  userId,
  email,
  phone,
  purpose,
  sendSecret = true,
  type = "otp",
}: SendOtpPayload) => {
  let session = await OtpSessionModel.findOne({ userId, purpose, type });

  if (!session) {
    const secret = OtpSessionModel.generateSecret(type);
    session = await OtpSessionModel.create({ userId, purpose, secret, type });
  }

  if (sendSecret) {
    if (email) await sendEmail({ purpose, email, secret: session.secret });
    else if (phone) await sendSms({ purpose, phone, secret: session.secret });
    else throw new Error("Either email or phone must be provided.");
  }

  return session;
};

export const verifyOtp = async ({
  userId,
  purpose,
  secret,
  verifyOnly = false,
  type = "otp",
}: verifyOtpPayload) => {
  const session = await OtpSessionModel.findOne({ userId, purpose, type });
  if (!session || !session.verifySecret(secret))
    throw new Error("Invalid or expired OTP.");
  if (verifyOnly) return session;
  else await OtpSessionModel.deleteOne({ _id: session._id });
};
