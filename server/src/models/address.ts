import mongoose, { Schema, Document } from "mongoose";

export interface IUserAddress {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IAddressModel extends Document, IUserAddress {
  userId: mongoose.Types.ObjectId;
  isDefault: boolean;
  type: "shipping" | "billing";
  label: "home" | "work";
}

const AddressSchema = new Schema<IAddressModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["shipping", "billing"],
      default: "shipping",
    },
    label: { type: String, enum: ["home", "work"], default: "home" },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model<IAddressModel>("Address", AddressSchema);

export default AddressModel;
