import mongoose, { Schema, Document } from "mongoose";

export type PaymentMethod =
  | "COD"
  | "Card"
  | "Wallet"
  | "GooglePay"
  | "ApplePay";

export type PaymentStatus = "Pending" | "Completed" | "Failed";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  walletId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "Wallet", "GooglePay", "ApplePay"],
      required: true,
    },
    transactionId: { type: String },
    walletId: { type: String },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
export default PaymentModel;
