// models/wishlist.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default WishlistModel;
