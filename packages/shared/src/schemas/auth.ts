import { z } from "zod";

const emailField = z.string().nonempty("Enter a valid email address").email();

const passwordField = z
  .string()
  .nonempty()
  .min(8, "Password must be at least 8 characters long");

const purposeField = z.enum(["verifyEmail", "setPassword", "resetPassword"], {
  required_error: "OTP purpose is required",
  invalid_type_error: "Invalid OTP purpose",
});

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

// Signup Schema
export const signupSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().optional(),
  identifier: identifierField,
  password: passwordField,
});

// Login Schema
export const loginSchema = z.object({
  identifier: identifierField,
  password: passwordField,
});

// Request OTP Schema
export const requestOtpSchema = z.object({
  identifier: identifierField,
  purpose: purposeField,
});

// Validate OTP Schema
export const validateOtpSchema = z.object({
  identifier: identifierField,
  secret: z.string().nonempty("OTP secret is required"),
  purpose: purposeField,
  verifyOnly: z.boolean().optional(),
  type: z.enum(["otp", "token"]).optional(),
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  identifier: identifierField,
  password: passwordField,
  secret: z.string().nonempty("OTP secret is required"),
  purpose: z.enum(["setPassword", "resetPassword"], {
    required_error: "Purpose is required",
    invalid_type_error: "Invalid purpose",
  }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TSignupSchema = z.infer<typeof signupSchema>;
export type TRequestOtpSchema = z.infer<typeof requestOtpSchema>;
export type TValidateOtpSchema = z.infer<typeof validateOtpSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
