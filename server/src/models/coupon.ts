import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  expires: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["Percentage", "Fixed"],
      required: true,
    },
    value: { type: Number, required: true },
    expires: { type: Date, required: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema);
export default CouponModel;
