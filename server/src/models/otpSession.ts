import { Schema, model, Document, ObjectId, Model } from "mongoose";
import crypto from "crypto";

export type OtpType = "token" | "otp";
export type OtpPurpose = "verifyEmail" | "resetPassword" | "setPassword";

export interface IOtpSession extends Document {
  userId: ObjectId;
  purpose: OtpPurpose;
  secret: string;
  expireAt: Date;
  verifySecret(secret: string): boolean;
}

export interface IOtpSessionModel extends Model<IOtpSession> {
  generateSecret(type: OtpType): string;
}

const otpSessionSchema = new Schema<IOtpSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  purpose: {
    type: String,
    enum: ["verifyEmail", "resetPassword", "setPassword"],
    required: true,
  },
  secret: { type: String, required: true },
  expireAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});

otpSessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

otpSessionSchema.statics.generateSecret = function (type: OtpType): string {
  return type === "token"
    ? crypto.randomBytes(32).toString("hex")
    : crypto.randomInt(100000, 999999).toString();
};

otpSessionSchema.methods.verifySecret = function (secret: string): boolean {
  return this.secret === secret;
};

const OtpSessionModel = model<IOtpSession, IOtpSessionModel>(
  "OtpSession",
  otpSessionSchema
);

export default OtpSessionModel;
