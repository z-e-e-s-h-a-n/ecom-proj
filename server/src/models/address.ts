import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ["shipping", "billing"], default: "shipping" },
    label: { type: String, default: "Home" },
  },
  { timestamps: true }
);

export type TAddressSchema = InferMongooseSchema<typeof addressSchema>;
const AddressModel = model("Address", addressSchema);

export default AddressModel;
