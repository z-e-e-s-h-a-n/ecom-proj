import { z } from "zod";

export const shippingSchema = z.object({
  weight: z.object({
    unit: z.enum(["kg", "g"]),
    value: z.number().positive("Weight must be positive"),
  }),
  dimensions: z.object({
    unit: z.enum(["cm", "in"]),
    length: z.number().positive("Length must be positive"),
    width: z.number().positive("Width must be positive"),
    height: z.number().positive("Height must be positive"),
  }),
});

// Variation Schema
export const variationSchema = z.object({
  sku: z.string().optional(),
  pricing: z.array(
    z.object({
      currencyId: z.string().nonempty("Currency ID is required"),
      original: z.number().positive("Original price must be positive"),
      sale: z.number().positive().optional(),
    })
  ),
  stock: z.number().min(0, "Stock must be at least 0"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  attributes: z.record(z.string()).optional(),
  shipping: shippingSchema,
  isDefault: z.boolean().default(false),
});

// Main Product Schema
export const productSchema = z.object({
  title: z.string().nonempty("Product Name is required"),
  slug: z.string().optional(),
  highlights: z.string().optional(),
  description: z.string().nonempty("Product description is required"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  video: z.string().url("Invalid video URL").optional(),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).default(0),
  category: z.string().nonempty("Category ID is required"),
  variations: z
    .array(variationSchema)
    .min(1, "At least one variation is required"),
  attributes: z.array(
    z.object({
      id: z.string().nonempty("Attribute ID is required"),
      options: z
        .array(z.string().nonempty())
        .min(1, "At least one option is required"),
    })
  ),
  specifications: z.array(
    z.object({
      id: z.string().nonempty("Specification ID is required"),
      value: z.string().nonempty("Specification value is required"),
    })
  ),
  reviews: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export type TShippingSchema = z.infer<typeof shippingSchema>;
export type TProductSchema = z.infer<typeof productSchema>;
export type TVariationSchema = z.infer<typeof variationSchema>;
