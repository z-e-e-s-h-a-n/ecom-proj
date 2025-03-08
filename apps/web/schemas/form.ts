import { z, ZodType } from "zod";

export type SchemaType<S extends ZodType> = z.infer<S>;

const emailField = z.string().email({ message: "Enter a valid email address" });

const passwordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

const nameField = z
  .string()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(100, "Name must not exceed 100 characters");

const mobileField = z.string().refine((value) => /^\d{11}$/.test(value), {
  message: "Enter a valid phone number",
});

const zipField = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format");

const identifierField = z.string().superRefine((value, ctx) => {
  if (!value.trim()) {
    ctx.addIssue({ code: "custom", message: "Enter an email or phone number" });
    return;
  }

  if (/^\d/.test(value)) {
    if (!/^\d{11}$/.test(value)) {
      ctx.addIssue({ code: "custom", message: "Enter a valid phone number" });
    }
  } else {
    if (!emailField.safeParse(value).success) {
      ctx.addIssue({ code: "custom", message: "Enter a valid email" });
    }
  }
});

const requiredString = (msg = "Required") => z.string().nonempty(msg);

export const serverResponseSchema = z
  .object({
    isLoading: z.boolean().default(false),
    errorMessage: z.string().default(""),
  })
  .optional();

export const otpFormSchema = z
  .object({
    otp: requiredString("Otp Is Requires").length(
      6,
      "OTP must be exactly 6 digits long"
    ),
    sendingOtp: z.boolean().default(false),
    response: serverResponseSchema,
  })
  .superRefine((value, ctx) => {
    if (!/^\d{6}$/.test(value.otp)) {
      ctx.addIssue({ code: "custom", message: "Invalid OTP" });
    }
  });

export const signinSchema = z.object({
  identifier: identifierField,
  password: passwordField,
  response: serverResponseSchema,
});

export const signupSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  identifier: identifierField,
  password: passwordField,
  response: serverResponseSchema,
});

export const resetPasswordSchema = z
  .discriminatedUnion("isAuth", [
    z.object({
      identifier: identifierField,
      isAuth: z.literal(false),
      password: passwordField.optional(),
      confirmPassword: passwordField.optional(),
      response: serverResponseSchema,
    }),
    z.object({
      identifier: identifierField,
      isAuth: z.literal(true),
      password: passwordField,
      confirmPassword: passwordField,
      response: serverResponseSchema,
    }),
  ])
  .refine(
    (data) => {
      if (data.isAuth) return data.password === data.confirmPassword;
      return true;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export const addressSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  street: requiredString("Address is Required"),
  city: requiredString("City is Required"),
  state: requiredString("State is Required"),
  zip: zipField,
  country: requiredString("Country is Required"),
  isDefault: z.boolean().optional().default(false),
});

export const paymentFormSchema = z.object({
  name: requiredString("Name is required"),
  number: requiredString("Card number is required"),
  expiry: requiredString("Expiry date is required"),
  cvv: requiredString("CVV is required"),
});

export const couponSchema = z.object({
  coupon: requiredString("Coupon Code is required").min(
    3,
    "Coupon Code must be at least 3 characters"
  ),
});

export const checkoutFormSchema = z.object({
  identifier: identifierField,
  newsletter: z.boolean().default(true),
  saveInfo: z.boolean().default(true),
  shipping: z.object({
    method: z.enum(["standard", "express", "free"]),
    address: addressSchema,
    cost: z.number().default(0),
  }),
  billing: z.discriminatedUnion("method", [
    z.object({
      method: z.literal("different"),
      address: addressSchema,
    }),
    z.object({
      method: z.literal("same"),
    }),
  ]),
  payment: z.discriminatedUnion("method", [
    z.object({
      method: z.literal("card"),
      card: paymentFormSchema,
    }),
    z.object({
      method: z.literal("cod"),
    }),
  ]),
  response: serverResponseSchema,
  editCart: z.boolean().default(false),
  coupon: z.string().optional(),
});

export const validateSubSchema = (
  schema: z.ZodSchema,
  value: unknown,
  basePath: (string | number)[],
  ctx: z.RefinementCtx
) => {
  const result = schema.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((err) => {
      ctx.addIssue({
        code: "custom",
        message: err.message,
        path: [...basePath, ...err.path],
      });
    });
  }
};

// **Type Definitions**
export type TSignInSchema = SchemaType<typeof signinSchema>;
export type TSignUpSchema = SchemaType<typeof signupSchema>;
export type TResetPassSchema = SchemaType<typeof resetPasswordSchema>;
export type TAddressSchema = SchemaType<typeof addressSchema>;
export type TCheckoutFormSchema = SchemaType<typeof checkoutFormSchema>;
export type TPaymentFormSchema = SchemaType<typeof paymentFormSchema>;
export type TCouponSchema = SchemaType<typeof couponSchema>;
export type TOtpFormSchema = SchemaType<typeof otpFormSchema>;
