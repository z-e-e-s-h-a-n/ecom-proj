import { z } from "zod";

export const wishlistItemSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().nonempty("variantId is required"),
});

export const wishlistSchema = z.array(wishlistItemSchema).min(1);
