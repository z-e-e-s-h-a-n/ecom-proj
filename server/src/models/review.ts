import mongoose, { ObjectId, Schema } from "mongoose";

// Review Schema
export interface IReview extends Document {
  userId: ObjectId;
  productId: ObjectId;
  variantId: ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);
export default ReviewModel;
