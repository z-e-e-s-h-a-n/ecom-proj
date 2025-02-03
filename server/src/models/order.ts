import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { PaymentStatus } from "./payment";

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Canceled";
export interface IOrderItem {
  productId: ObjectId;
  variantId: ObjectId;
  quantity: number;
  pricing: {
    price: number;
    symbol: string;
    currency: string;
  };
}

export interface IOrder extends Document {
  userId: ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentId: ObjectId;
  orderStatus: OrderStatus;
  metadata: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        pricing: {
          price: { type: Number, required: true },
          symbol: { type: String, require: true },
          currency: { type: String, required: true },
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
export default OrderModel;
