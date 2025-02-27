import { InferMongooseSchema } from "@/types/global";
import { model, Schema } from "mongoose";

const cardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  { timestamps: true }
);

export type TCardSchema = InferMongooseSchema<typeof cardSchema>;
const CardModel = model("Card", cardSchema);

export default CardModel;
