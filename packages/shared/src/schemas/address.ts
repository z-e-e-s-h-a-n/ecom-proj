import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "Zip code is required"),
  isDefault: z.boolean().default(true).optional(),
  type: z.enum(["shipping", "billing"]).default("shipping"),
  label: z.string().default("Home").optional(),
});

export type TAddressSchema = z.infer<typeof addressSchema>;
