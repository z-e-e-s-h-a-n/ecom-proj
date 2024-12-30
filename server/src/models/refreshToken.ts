import mongoose, { Schema, ObjectId } from "mongoose";

export interface IRefreshToken extends Document {
  userId: ObjectId;
  token: string;
  blacklisted: boolean;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  blacklisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const RefreshTokenModel = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshTokenModel;
