import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ICard extends Document {
  userId: ObjectId;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  { timestamps: true }
);

const CardModel = mongoose.model<ICard>("Card", cardSchema);
export default CardModel;
