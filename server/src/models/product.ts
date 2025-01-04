import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  desc: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  pricing: {
    [countryCode: string]: { original: number; sale?: number };
  };
  availability: {
    [countryCode: string]: boolean;
  };
  stock: number;
  variants: {
    colors: string[];
    sizes: string[];
    attributes: Record<string, string | number>;
  };
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  isActive: boolean;
  tags: string[];
  specs: Record<string, string | number>;
  brand: string;
  sku: string;
  upc: string;
  material: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    images: { type: [String], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    pricing: {
      US: {
        original: { type: Number, required: true },
        sale: { type: Number },
      },
      PK: {
        original: { type: Number, required: true },
        sale: { type: Number },
      },
    },
    availability: {
      US: { type: Boolean, required: true },
      PK: { type: Boolean, required: true },
    },
    stock: { type: Number, default: 0 },
    variants: {
      colors: [{ type: String }],
      sizes: [{ type: String }],
      attributes: { type: Map, of: Schema.Types.Mixed, default: {} },
    },
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    specs: { type: Map, of: Schema.Types.Mixed },
    brand: { type: String, required: true },
    sku: { type: String, required: true },
    upc: { type: String },
    material: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);
export default ProductModel;
