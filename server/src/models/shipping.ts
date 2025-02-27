import { InferMongooseSchema } from "@/types/global";
import { Schema, model, Types } from "mongoose";

const pricingSchema = new Schema({
  type: {
    type: String,
    enum: ["fixed", "formula"],
    default: "fixed",
  },
  value: { type: String, required: true },
});

const categoryOverrideSchema = new Schema({
  category: { type: Types.ObjectId, ref: "Category", required: true },
  pricing: pricingSchema,
});

const requirementsSchema = new Schema({
  type: {
    type: String,
    enum: ["none", "minAmount", "coupon", "either"],
    default: "none",
  },
  minAmount: Number,
  couponId: { type: Types.ObjectId, ref: "Coupon" },
});

const shippingMethodSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["flatRate", "freeShipping"],
    required: true,
  },
  pricing: pricingSchema,
  categoryOverrides: [categoryOverrideSchema],
  requirements: requirementsSchema,
});

const shippingZoneSchema = new Schema(
  {
    zoneName: { type: String, required: true },
    description: { type: String },
    countries: [{ type: String, required: true }],
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    shippingMethods: [shippingMethodSchema],
  },
  { timestamps: true }
);

export type TShippingZoneSchema = InferMongooseSchema<
  typeof shippingZoneSchema
>;
export type TShippingMethod = InferMongooseSchema<typeof shippingMethodSchema>;
export type TShippingMethodPricing = TShippingMethod["pricing"];
const ShippingZoneModel = model("ShippingZone", shippingZoneSchema);
export default ShippingZoneModel;
