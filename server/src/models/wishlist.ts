import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const wishlistSchema = new Schema(
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
      },
    ],
  },
  { timestamps: true }
);

export type TWishlistSchema = InferMongooseSchema<typeof wishlistSchema>;
const WishlistModel = model("Wishlist", wishlistSchema);

export default WishlistModel;
