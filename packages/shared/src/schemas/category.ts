import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().nonempty("Attribute Name is required"),
  slug: z.string().nonempty("Attribute Slug is required"),
  desc: z.string().optional(),
  image: z.string().optional(),
  parent: z.string().optional(),
});

export type TCategorySchema = z.infer<typeof categorySchema>;
