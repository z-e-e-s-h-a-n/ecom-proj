import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IShippingMethod extends Document {
  zone: string;
  enabled: boolean;
  description: string;
  countries: string[];
  methods: {
    name: string;
    type: "flatRate" | "freeShipping";
    cost: string;
    categories: ObjectId[];
    require: "none" | "coupon" | "min" | "either";
    calcType: "perClass" | "perOrder";
  }[];
}

const shippingMethodSchema = new Schema<IShippingMethod>(
  {
    zone: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    description: { type: String, require: true },
    countries: [{ type: String, required: true }],
    methods: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["flatRate", "freeShipping"],
          required: true,
        },
        cost: { type: String, required: true },
        categories: [
          { type: Schema.Types.ObjectId, ref: "Category", require: true },
        ],
        require: {
          type: String,
          enum: ["none", "coupon", "min", "either"],
          default: "none",
        },
        calcType: {
          type: String,
          enum: ["perClass", "perOrder"],
          default: "perOrder",
        },
      },
    ],
  },
  { timestamps: true }
);

const ShippingMethodModel = mongoose.model<IShippingMethod>(
  "ShippingMethod",
  shippingMethodSchema
);

export default ShippingMethodModel;
