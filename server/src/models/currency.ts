import { getExchangeRates } from "@/lib/utils/helper";
import getSymbolFromCurrency from "currency-symbol-map";
import mongoose, { Schema, Document } from "mongoose";

export interface ICurrencyOption extends Document {
  currency: string;
  symbol: string;
  multiplier: number;
  isDefault: boolean;
  countries: string[];
  decimalSeparator: string;
  thousandSeparator: string;
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
    { type: String, required: true, match: /^[A-Z]{2}$/, unique: true },
  ],
  decimalSeparator: { type: String, required: true, default: "." },
  thousandSeparator: { type: String, required: true, default: "," },
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
