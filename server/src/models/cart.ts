import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const cartSchema = new Schema(
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

export type TCartSchema = InferMongooseSchema<typeof cartSchema>;
const CartModel = model("Cart", cartSchema);

export default CartModel;
