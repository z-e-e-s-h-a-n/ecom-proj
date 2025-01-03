import { z, ZodType } from "zod";

// Utility type to infer TypeScript types from Zod schemas
export type SchemaType<S extends ZodType> = z.infer<S>;

// Shared Fields
const emailField = z
  .string()
  .email({ message: "Please enter a valid email address" });
const passwordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });
const nameField = z
  .string()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(100, "Name must not exceed 100 characters");
const mobileField = z.string().refine((value) => value.length === 11, {
  message: "Mobile number must be exactly 11 digits",
});
const zipField = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format");
const requiredString = (fieldName: string) =>
  z.string().nonempty(`${fieldName} is required`);

// Authentication Schemas
export const signinSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const signupSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: emailField,
  password: passwordField,
});

export const resetPasswordSchema = z
  .object({
    email: emailField,
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const resetEmailSchema = z.object({
  email: emailField,
});

// Address Schemas
export const addressSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  phone: mobileField,
  country: requiredString("Country"),
  address: requiredString("Address"),
  city: requiredString("City"),
  state: requiredString("State"),
  zip: zipField,
  isDefault: z.boolean().optional().default(false),
});

export const cardPaymentSchema = z.object({
  cardName: z.string().nonempty("Name is required"),
  cardNumber: z.string().nonempty("Card number is required"),
  expiryDate: z.string().nonempty("Expiry date is required"),
  cvv: z.string().nonempty("CVV is required"),
});

// TypeScript Types
export type TSignInSchema = SchemaType<typeof signinSchema>;
export type TSignUpSchema = SchemaType<typeof signupSchema>;
export type TResetPassSchema = SchemaType<typeof resetPasswordSchema>;
export type TResetEmailSchema = SchemaType<typeof resetEmailSchema>;
export type TAddressSchema = SchemaType<typeof addressSchema>;
export type TCardPaymentSchema = SchemaType<typeof cardPaymentSchema>;
