import mongoose, { Schema, Document } from "mongoose";

export interface ICurrencyOption extends Document {
  country: string;
  currency: string;
  countryCode: string;
  symbol: string;
  multiplier: number;
  isDefault: boolean;
}

const CurrencyOptionSchema = new Schema<ICurrencyOption>({
  country: { type: String, required: true, unique: true },
  currency: { type: String, required: true, unique: true },
  countryCode: { type: String, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
  multiplier: { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
});

const CurrencyOptionModel = mongoose.model<ICurrencyOption>(
  "CurrencyOption",
  CurrencyOptionSchema
);

export default CurrencyOptionModel;
