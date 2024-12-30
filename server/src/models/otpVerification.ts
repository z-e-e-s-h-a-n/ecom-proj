import mongoose, { Document, Schema, ObjectId } from "mongoose";
import crypto from "crypto";

export interface IOtpVerification extends Document {
  userId: ObjectId;
  otp: string;
  purpose: string;
  createdAt: Date;
  generateOtp(): string;
  verifyOtp(providedOtp: string): Promise<boolean>;
}

const otpVerificationSchema = new Schema<IOtpVerification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

otpVerificationSchema.methods.generateOtp = function () {
  this.otp = crypto.randomInt(100000, 999999).toString();
  return this.otp;
};

otpVerificationSchema.methods.verifyOtp = function (inputOtp: string) {
  return this.otp === inputOtp;
};

const OtpVerificationModel = mongoose.model<IOtpVerification>(
  "OtpVerification",
  otpVerificationSchema
);

export default OtpVerificationModel;
