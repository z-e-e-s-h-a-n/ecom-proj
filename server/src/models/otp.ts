import mongoose, { Document, Schema, ObjectId, Model } from "mongoose";
import crypto from "crypto";

export interface IOtp extends Document {
  userId: ObjectId;
  otp: string;
  purpose: string;
  createdAt: Date;
  generateOtp(): string;
  verifyOtp(providedOtp: string): Promise<boolean>;
}

export interface IOtpModel extends Model<IOtp> {
  generateOtp(): string;
}

const otpSchema = new Schema<IOtp>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

otpSchema.methods = {
  verifyOtp: function (inputOtp: string) {
    return this.otp === inputOtp;
  },
};

otpSchema.statics = {
  generateOtp: function () {
    return crypto.randomInt(100000, 999999).toString();
  },
};

const OtpModel = mongoose.model<IOtp, IOtpModel>("OtpVerification", otpSchema);

export default OtpModel;
