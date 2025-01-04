import { Schema, model, Document, ObjectId } from "mongoose";
import crypto from "crypto";

export interface ITempSession extends Document {
  userId: ObjectId;
  token: string;
  purpose: string;
  createdAt: Date;
  generateToken(): string;
  verifyToken(providedToken: string): boolean;
}

const tempSessionSchema = new Schema<ITempSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, unique: true },
  purpose: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

// Method to generate a token
tempSessionSchema.methods.generateToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  this.token = token;
  return this.token;
};

// Method to verify a token
tempSessionSchema.methods.verifyToken = function (
  providedToken: string
): boolean {
  return this.token === providedToken;
};

const TempSessionModel = model<ITempSession>("TempSession", tempSessionSchema);

export default TempSessionModel;
