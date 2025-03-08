import { TShippingZoneSchema } from "@workspace/shared/schemas/shipping";
import { Schema, model } from "mongoose";

const shippingRateSchema = new Schema({
  weight: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  volume: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  price: { type: Number, required: true },
});

const freeShippingSchema = new Schema({
  isActive: { type: Boolean, default: true },
  duration: {
    start: { type: Date },
    end: { type: Date },
  },
  condition: {
    type: { type: String, enum: ["none", "min"], required: true },
    threshold: { type: Number, required: true },
  },
  scope: { type: String, enum: ["all", "specific"], required: true },
  products: [{ type: String }],
  categories: [{ type: String }],
});

const shippingMethodSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["standard", "express"], required: true },
  rates: [shippingRateSchema],
  freeShipping: freeShippingSchema,
});

const shippingZoneSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  countries: [{ type: String, required: true }],
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  methods: [shippingMethodSchema],
});

const ShippingZoneModel = model<TShippingZoneSchema>(
  "ShippingZone",
  shippingZoneSchema
);
export default ShippingZoneModel;
