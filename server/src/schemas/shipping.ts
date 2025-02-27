import { z } from "zod";

const pricingSchema = z.object({
  type: z.enum(["fixed", "formula"]).default("fixed"),
  value: z.string().nonempty("Value is required"),
});

export const shippingMethodSchema = z.object({
  name: z.string().nonempty("Shipping Method Name is required"),
  type: z.enum(["flatRate", "freeShipping"]),
  pricing: pricingSchema,
  categoryOverrides: z.array(
    z.object({
      category: z.string().nonempty("Category ID is required"),
      pricing: pricingSchema,
    })
  ),
  requirements: z.object({
    type: z.enum(["none", "minAmount", "coupon", "either"]).default("none"),
    minAmount: z.number().positive().optional(),
    couponId: z.string().optional(),
  }),
});

export const shippingZoneSchema = z.object({
  zoneName: z.string().nonempty("Shipping Zone is required"),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  shippingMethods: z.array(shippingMethodSchema),
});

export const calcShippingSchema = z.object({
  country: z.string().regex(/^[A-Z]{2}$/, "invalid country code"),
  subtotal: z.number().positive("Subtotal must be positive number"),
  couponId: z.string().optional(),
  items: z
    .array(
      z.object({
        categoryId: z.string().nonempty("Category ID is required"),
        price: z.number().positive("Price must be positive number"),
        quantity: z.number().positive("Quantity must be positive number"),
      })
    )
    .min(1, "min one item is required"),
});
