import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().nonempty("variantId is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().nonempty("comment is required"),
});
