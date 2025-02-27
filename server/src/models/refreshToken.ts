import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deviceInfo: {
    name: { type: String, required: true },
    ip: { type: String, required: true },
    location: { type: String },
    lastUsed: { type: Date, required: true },
    userAgent: { type: String },
    os: { type: String },
    browser: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  blacklisted: { type: Boolean, default: false },
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type TRefreshTokenSchema = InferMongooseSchema<
  typeof refreshTokenSchema
>;
const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
