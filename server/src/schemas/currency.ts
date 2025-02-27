import { z } from "zod";

export const currencySchema = z.object({
  symbol: z.string().nonempty("currency symbol is required"),
  currency: z
    .string()
    .nonempty("currency symbol is required")
    .regex(/^[A-Z]{3}$/, "invalid currency name"),
  multiplier: z.number().positive(),
  isDefault: z.boolean().default(false),
  countries: z
    .array(z.string().regex(/^[A-Z]{2}$/, "invalid country code"))
    .min(1),
  decimalSeparator: z.string().optional(),
  thousandSeparator: z.string().optional(),
});
