import mongoose, { Schema, Document, ObjectId } from "mongoose";

export type TOrderStatus = "pending" | "shipped" | "delivered" | "canceled";
export type TPaymentMethod = "cod" | "card" | "wallet" | "gPay" | "applePay";
export type TPaymentStatus = "pending" | "completed" | "failed";
export type TBillingMethod = "same" | "different";
export type TShippingMethod = "standard" | "express" | "free";

export interface IOrderItem {
  productId: ObjectId;
  variantId: ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  orderStatus: TOrderStatus;
  transactionId?: string;
  metadata: Map<string, any>;
  shipping: { method: TShippingMethod; addressId: ObjectId; cost: number };
  billing: { method: TBillingMethod; addressId?: ObjectId };
  payment: {
    method: TPaymentMethod;
    status: TPaymentStatus;
    currency: string;
    symbol: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
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

const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
export default OrderModel;
