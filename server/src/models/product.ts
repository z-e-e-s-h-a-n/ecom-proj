import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";
import crypto from "crypto";
import { formatProductPricing } from "@/utils/helper";
import { Request } from "express";

export interface IShipping {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface IVariant extends IShipping {
  pricing: {
    country: string;
    countryCode: string;
    currency: string;
    symbol: string;
    original: number;
    sale?: number;
  }[];
  sku?: string;
  stock: number;
  images: string[];
  attributes: Record<string, string>;
  isActive: boolean;
  isDefault: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug?: string;
  highlights?: string[];
  description: string;
  images: string[];
  video?: string;
  tags: string[];
  rating: number;
  category: ObjectId;
  variations: IVariant[];
  attributes: { id: ObjectId; options: string[] }[];
  specifications: { id: ObjectId; value: string }[];
  reviews: ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductModel extends Model<IProduct> {
  findByCategory(categoryId: ObjectId): Promise<IProduct[]>;
  findByRating(rating: number): Promise<IProduct[]>;
  searchByName(searchTerm: string): Promise<IProduct[]>;
  fetchFormattedProduct(
    req: Request,
    productId: string
  ): Promise<IProduct | null>;
}

const variationSchema = new Schema<IVariant>({
  sku: { type: String, unique: true },
  pricing: [
    {
      country: { type: String, required: true },
      currency: { type: String, required: true },
      countryCode: { type: String, required: true },
      symbol: { type: String, required: true },
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
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    highlights: { type: [String], default: [] },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    variations: {
      type: [variationSchema],
      validate: {
        validator: function (v: IVariant[]) {
          return v && v.length > 0;
        },
        message: "Product must have at least one variation.",
      },
    },
    attributes: [
      {
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

productSchema.pre("save", async function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }

  let defaultVariant = false;

  this.variations.forEach((variant: IVariant) => {
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

variationSchema.pre("validate", function (next) {
  const seen = new Set();
  for (const price of this.pricing) {
    const key = `${price.country}-${price.countryCode}-${price.currency}`;
    if (seen.has(key)) {
      return next(
        new Error(
          `Duplicate pricing entry found for ${price.country} (${price.countryCode}) in ${price.currency}`
        )
      );
    }
    seen.add(key);
  }
  next();
});

productSchema.post(["find", "findOne"], async function (docs, next) {
  if (!docs) return next();

  const req = this.getOptions()?.req as Request | undefined;
  if (!req) return next();

  if (Array.isArray(docs)) {
    await Promise.all(
      docs.map(async (doc) => {
        doc.variations = await formatProductPricing(req, doc);
      })
    );
  } else {
    docs.variations = await formatProductPricing(req, docs);
  }

  next();
});

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

productSchema.statics = {
  findByCategory: function (categoryId: ObjectId) {
    return this.find({ category: categoryId });
  },

  findByRating: function (rating: number) {
    return this.find({ rating: { $gte: rating } }).sort({ rating: -1 });
  },

  searchByName: function (searchTerm: string) {
    const regex = new RegExp(searchTerm, "i");
    return this.find({ name: { $regex: regex } });
  },
};

const ProductModel = mongoose.model<IProduct, IProductModel>(
  "Product",
  productSchema
);

export default ProductModel;
