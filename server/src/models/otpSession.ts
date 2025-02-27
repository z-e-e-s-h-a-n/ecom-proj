import { Schema, model } from "mongoose";
import crypto from "crypto";
import { InferMongooseSchema } from "@/types/global";

const otpSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["token", "otp"], required: true },
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
  },
  {
    methods: {
      verifySecret(secret): boolean {
        return this.secret === secret;
      },
    },
    statics: {
      generateSecret(type): string {
        return type === "token"
          ? crypto.randomBytes(32).toString("hex")
          : crypto.randomInt(100000, 999999).toString();
      },
    },
    timestamps: true,
  }
);

otpSessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export type TOtpSessionSchema = InferMongooseSchema<typeof otpSessionSchema>;
export type OtpType = TOtpSessionSchema["type"];
export type OtpPurpose = TOtpSessionSchema["purpose"];
const OtpSessionModel = model("OtpSession", otpSessionSchema);

export default OtpSessionModel;
