import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    transactionId: { type: String },
    shipping: {
      method: {
        type: String,
        required: true,
        enum: ["free", "standard", "express"],
      },
      cost: { type: Number, required: true },
      addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
    },
    billing: {
      method: { type: String, required: true, enum: ["same", "different"] },
      addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    },
    payment: {
      method: {
        type: String,
        enum: ["cod", "card", "wallet", "gPay", "applePay"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      currency: { type: String, required: true, match: /^[A-Z]{3}$/ },
      symbol: { type: String, required: true },
    },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export type TOrderSchema = InferMongooseSchema<typeof orderSchema>;
const OrderModel = model("Order", orderSchema);

export default OrderModel;
