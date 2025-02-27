import { z } from "zod";

// Variation Schema
export const productVariationSchema = z.object({
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
  shipping: z.object({
    massUnit: z.enum(["kg", "lb", "g"], {
      required_error: "Mass unit is required",
    }),
    distanceUnit: z.enum(["cm", "in"], {
      required_error: "Distance unit is required",
    }),
    weight: z.number().positive("Weight must be positive"),
    length: z.number().positive("Length must be positive"),
    width: z.number().positive("Width must be positive"),
    height: z.number().positive("Height must be positive"),
  }),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

// Attribute Schema
export const productAttributeSchema = z.object({
  id: z.string().nonempty("Attribute ID is required"),
  options: z
    .array(z.string().nonempty())
    .min(1, "At least one option is required"),
});

// Specification Schema
export const productSpecificationSchema = z.object({
  id: z.string().nonempty("Specification ID is required"),
  value: z.string().nonempty("Specification value is required"),
});

// Main Product Schema
export const productSchema = z.object({
  name: z.string().nonempty("Product Name is required"),
  slug: z.string().nonempty("Product Slug is required"),
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
    .array(productVariationSchema)
    .min(1, "At least one variation is required"),
  attributes: z.array(productAttributeSchema).optional(),
  specifications: z.array(productSpecificationSchema).optional(),
  reviews: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});
