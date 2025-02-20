import OtpSessionModel, { OtpPurpose, OtpType } from "@/models/otpSession";
import { sendEmail } from "@/config/nodemailer";
import { sendSms } from "@/config/twilio";
import { ObjectId } from "@/types/global";

export interface SendOtpPayload {
  userId: string | ObjectId;
  email?: string;
  phone?: string;
  purpose: OtpPurpose;
  sendSecret?: boolean;
  type?: OtpType;
}

export interface verifyOtpPayload {
  userId: string | ObjectId;
  secret: string;
  purpose: OtpPurpose;
  verifyOnly?: boolean;
}

export const sendOtp = async ({
  userId,
  email,
  phone,
  purpose,
  sendSecret = true,
  type = "otp",
}: SendOtpPayload) => {
  let session = await OtpSessionModel.findOne({ userId, purpose });

  if (!session) {
    const secret = OtpSessionModel.generateSecret(type);
    session = await OtpSessionModel.create({ userId, purpose, secret });
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
}: verifyOtpPayload) => {
  const session = await OtpSessionModel.findOne({ userId, purpose });
  if (!session || !session.verifySecret(secret))
    throw new Error("Invalid or expired OTP.");
  if (verifyOnly) return session;
  else await OtpSessionModel.deleteOne({ _id: session._id });
};
