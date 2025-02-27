import { Schema, model } from "mongoose";
import crypto from "crypto";
import { InferMongooseSchema } from "@/types/global";

const variationSchema = new Schema({
  sku: { type: String, unique: true },
  pricing: [
    {
      currencyId: {
        type: Schema.Types.ObjectId,
        ref: "CurrencyOption",
        required: true,
      },
      original: { type: Number, required: true },
      sale: { type: Number },
    },
  ],
  stock: { type: Number, required: true },
  images: { type: [String], default: [] },
  attributes: {
    type: Map,
    of: String,
    get: (val: any) => (val ? Object.fromEntries(val) : {}),
  },
  shipping: {
    massUnit: { type: String, enum: ["kg", "lb", "g"], require: true },
    distanceUnit: { type: String, enum: ["cm", "in"], require: true },
    weight: { type: Number, require: true },
    length: { type: Number, require: true },
    width: { type: Number, require: true },
    height: { type: Number, require: true },
  },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    highlights: { type: String },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    variations: {
      type: [variationSchema],
      validate: {
        validator: function (v: TVariation) {
          return v && v.length > 0;
        },
        message: "Product must have at least one variant.",
      },
    },
    attributes: [
      {
        _id: false,
        id: {
          type: Schema.ObjectId,
          ref: "Attribute",
          required: true,
        },
        options: { type: [String], required: true },
      },
    ],
    specifications: [
      {
        _id: false,
        id: {
          type: Schema.ObjectId,
          ref: "Specification",
          required: true,
        },
        value: { type: String, required: true },
      },
    ],
    reviews: [{ type: Schema.ObjectId, ref: "Review" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre<TProductSchema>("save", async function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }

  let defaultVariant = false;

  this.variations.forEach((variant) => {
    const skuPrefix = this.name.substring(0, 3).toUpperCase();
    const uniqueSuffix = crypto.randomBytes(4).toString("hex");

    if (!variant.sku) {
      variant.sku = `${skuPrefix}-${uniqueSuffix}`;
    }

    if (variant.isDefault) {
      defaultVariant = true;
    }
  });

  if (!defaultVariant && this?.variations[0]) {
    this.variations[0].isDefault = true;
  }
  next();
});

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

export type TProductSchema = InferMongooseSchema<typeof productSchema>;
export type TVariation = TProductSchema["variations"];
const ProductModel = model("Product", productSchema);

export default ProductModel;
