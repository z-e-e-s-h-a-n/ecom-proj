import { getExchangeRates } from "@/utils/helper";
import getSymbolFromCurrency from "currency-symbol-map";
import mongoose, { Schema, Document } from "mongoose";

export interface ICurrencyOption extends Document {
  currency: string;
  symbol: string;
  multiplier: number;
  isDefault: boolean;
  countries: { name: string; code: string }[];
}

const CurrencyOptionSchema = new Schema<ICurrencyOption>({
  currency: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{3}$/,
  },
  symbol: { type: String, required: true, unique: true },
  multiplier: { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
  countries: [
    {
      name: { type: String, required: true, unique: true },
      code: { type: String, required: true, unique: true },
    },
  ],
});

CurrencyOptionSchema.pre<ICurrencyOption>("save", async function (next) {
  if (!this.symbol) {
    this.symbol = getSymbolFromCurrency(this.currency) || "$";
  }
  if (!this.multiplier) {
    this.multiplier = await getExchangeRates(this.currency, 1);
  }
  next();
});

const CurrencyOptionModel = mongoose.model<ICurrencyOption>(
  "CurrencyOption",
  CurrencyOptionSchema
);

export default CurrencyOptionModel;
