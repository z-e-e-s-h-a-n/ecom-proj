import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().nonempty("variantId is required"),
  quantity: z.number().min(1).optional(),
});

export const cartSchema = z.array(cartItemSchema).min(1);
