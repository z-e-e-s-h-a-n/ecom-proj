import { z } from "zod";

export const specificationSchema = z.object({
  name: z.string().nonempty("Specification Name is required"),
  options: z.array(z.string()).min(1, "At least one option is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  isRequired: z.boolean().default(false),
  isDefault: z.boolean().default(true),
});

export type TSpecificationSchema = z.infer<typeof specificationSchema>;
