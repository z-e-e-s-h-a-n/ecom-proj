import { z } from "zod";
import { shippingSchema } from "./product";

const shippingRateSchema = z.object({
  weight: z.object({
    min: z.number().positive("Minimum weight must be positive"),
    max: z.number().positive("Maximum weight must be positive"),
  }),
  volume: z.object({
    min: z.number().positive("Minimum volume must be positive"),
    max: z.number().positive("Maximum volume must be positive"),
  }),
  price: z.number().positive("Price must be positive"),
});

const freeShippingSchema = z.object({
  isActive: z.boolean().default(true),
  duration: z
    .object({
      start: z.date().min(new Date(), "Start date must be in the future"),
      end: z.date().min(new Date(), "End date must be in the future"),
    })
    .optional(),
  condition: z.object({
    type: z.enum(["none", "min"]),
    threshold: z.number().positive("Threshold must be positive"),
  }),
  scope: z.enum(["all", "specific"]),
  products: z.array(z.string()),
  categories: z.array(z.string()),
});

export const shippingMethodSchema = z.object({
  name: z.string().nonempty("Shipping Method Name is required"),
  type: z.enum(["standard", "express"]),
  rates: z.array(shippingRateSchema),
  freeShipping: freeShippingSchema.optional(),
});

export const shippingZoneSchema = z.object({
  name: z.string().nonempty("Shipping Zone is required"),
  description: z.string().optional(),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  methods: z.array(shippingMethodSchema),
});

export const calcShippingSchema = z.object({
  country: z.string().regex(/^[A-Z]{2}$/, "invalid country code"),
  couponId: z.string().optional(),
  items: z
    .array(
      z
        .object({
          productId: z.string().nonempty("Product ID is required"),
          categoryId: z.string().nonempty("Category ID is required"),
          price: z.number().positive("Price must be positive number"),
          quantity: z.number().positive("Quantity must be positive number"),
        })
        .merge(shippingSchema)
    )
    .min(1, "min one item is required"),
});

export type TCalcShippingSchema = z.infer<typeof calcShippingSchema>;
export type TShippingZoneSchema = z.infer<typeof shippingZoneSchema>;
export type TShippingMethodSchema = z.infer<typeof shippingMethodSchema>;
export type TShippingRateSchema = z.infer<typeof shippingRateSchema>;
export type TFreeShippingSchema = z.infer<typeof freeShippingSchema>;
