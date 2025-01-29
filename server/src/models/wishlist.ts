// models/wishlist.ts
import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IWishlistItem {
  productId: ObjectId;
  variantId: ObjectId;
}

export interface IWishlist extends Document {
  userId: ObjectId;
  items: IWishlistItem[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default WishlistModel;
