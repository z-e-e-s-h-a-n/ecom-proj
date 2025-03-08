import { z } from "zod";

export const attributeSchema = z.object({
  name: z.string().nonempty("Attribute Name is required"),
  options: z.array(z.string()).min(1, "At least one option is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  type: z.enum(["color", "select", "radio", "button", "image"]),
  isRequired: z.boolean().default(false),
  isDefault: z.boolean().default(true),
});

export type TAttributeSchema = z.infer<typeof attributeSchema>;
