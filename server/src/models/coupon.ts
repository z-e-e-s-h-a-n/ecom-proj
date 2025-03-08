import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    coupon: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discount: { type: Number, required: true },
    expires: { type: Date, required: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TCouponSchema = InferMongooseSchema<typeof couponSchema>;
const CouponModel = model("Coupon", couponSchema);

export default CouponModel;
