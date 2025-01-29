import mongoose, { Schema, ObjectId } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: ObjectId;
  deviceInfo: {
    id: string;
    name: string;
    ip: string;
    location?: string;
    lastUsed: Date;
    userAgent?: string;
    os?: string;
    browser?: string;
  };
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  blacklisted: boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deviceInfo: {
    id: { type: String, required: true },
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

// Index to automatically delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshTokenModel;
