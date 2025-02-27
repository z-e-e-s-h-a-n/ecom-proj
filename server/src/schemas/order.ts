import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().nonempty("variantId is required"),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  totalAmount: z.number().positive(),
  orderStatus: z
    .enum(["pending", "shipped", "delivered", "canceled"])
    .default("pending"),
  transactionId: z.string().optional(),
  shipping: z.object({
    method: z.enum(["free", "standard", "express"]),
    addressId: z.string().nonempty("addressId is required"),
    cost: z.number().optional(),
  }),
  billing: z.object({
    method: z.enum(["same", "different"]),
    addressId: z.string().nonempty("addressId is required"),
  }),
  payment: z.object({
    method: z.enum(["cod", "card", "wallet", "gPay", "applePay"]),
    status: z.enum(["pending", "completed", "failed"]),
    currency: z.string().regex(/^[A-Z]{3}$/, "invalid currency name"),
    symbol: z.string().nonempty("symbol is required"),
  }),
  metadata: z.map(z.string(), z.any()).optional(),
});
