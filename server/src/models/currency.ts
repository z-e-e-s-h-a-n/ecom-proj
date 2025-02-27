import { getExchangeRates } from "@/lib/utils/helper";
import { InferMongooseSchema } from "@/types/global";
import getSymbolFromCurrency from "currency-symbol-map";
import { Schema, model } from "mongoose";

const currencyOptionSchema = new Schema({
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

currencyOptionSchema.pre<TCurrencyOptionSchema>("save", async function (next) {
  if (!this.symbol) {
    this.symbol = getSymbolFromCurrency(this.currency) || "$";
  }
  if (!this.multiplier) {
    this.multiplier = await getExchangeRates(this.currency, 1);
  }
  next();
});

export type TCurrencyOptionSchema = InferMongooseSchema<
  typeof currencyOptionSchema
>;
const CurrencyOptionModel = model("CurrencyOption", currencyOptionSchema);

export default CurrencyOptionModel;
