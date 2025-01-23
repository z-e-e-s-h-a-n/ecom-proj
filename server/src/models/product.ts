import mongoose, { Schema, Document } from "mongoose";

export interface IShipping {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface IVariationValue extends IShipping {
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
}

export interface IVariation {
  type: string;
  values: IVariationValue[];
}

export interface IReview {
  user: mongoose.Types.ObjectId;
  comment: string;
  rating: number;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  video?: string;
  highlights?: string[];
  category: mongoose.Types.ObjectId;
  pricing: {
    region: string;
    currency: string;
    original: number;
    sale?: number;
    multiplier?: number;
  }[];
  stock: number;
  variations: IVariation[];
  tags: string[];
  isActive: boolean;
  rating: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;

  calculateShippingCost(
    weight: number,
    dimensions: { length: number; width: number; height: number }
  ): number;
  findVariationBySKU(sku: string): IVariationValue | null;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String },
    highlights: { type: [String], default: [] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    pricing: [
      {
        region: { type: String, required: true },
        currency: { type: String, required: true },
        original: { type: Number, required: true },
        sale: { type: Number },
        multiplier: { type: Number, default: 1 },
      },
    ],
    stock: { type: Number, default: 0 },
    variations: [
      {
        type: { type: String, required: true },
        values: [
          {
            price: { type: Number, required: true },
            salePrice: { type: Number },
            stock: { type: Number, required: true },
            sku: { type: String, required: true, unique: true },
            weight: { type: Number, default: 0 },
            dimensions: {
              length: { type: Number, default: 0 },
              width: { type: Number, default: 0 },
              height: { type: Number, default: 0 },
            },
          },
        ],
      },
    ],
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        rating: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("variations")) {
    this.variations.forEach((variation) => {
      variation.values.forEach((value) => {
        if (!value.sku) {
          value.sku = `${this.name.substring(0, 3).toUpperCase()}-${variation.type}-${Date.now()}`;
        }
      });
    });
  }
  next();
});

productSchema.methods.calculateShippingCost = function (
  weight: number,
  dimensions: { length: number; width: number; height: number }
): number {
  const volume = dimensions.length * dimensions.width * dimensions.height;
  return weight * 0.5 + volume * 0.01;
};

productSchema.methods.findVariationBySKU = function (
  sku: string
): IVariationValue | null {
  for (const variation of this.variations) {
    const value = variation.values.find((value: any) => value.sku === sku);
    if (value) return value;
  }
  return null;
};

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1 });

const ProductModel = mongoose.model<IProduct>("Product", productSchema);
export default ProductModel;
