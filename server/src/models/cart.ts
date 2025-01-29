import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ICartItem {
  productId: ObjectId;
  variantId: ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: ObjectId;
  items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);
export default CartModel;
