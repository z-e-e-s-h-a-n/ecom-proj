import * as z from "zod";

export const getAuthSchema = (type: AuthFormType["type"]) => {
  return z.object({
    firstName:
      type === "sign-up"
        ? z
            .string()
            .min(2, {
              message: "First name must be at least 2 characters long",
            })
            .max(30, { message: "First name must not exceed 30 characters" })
        : z.string().optional(),
    lastName:
      type === "sign-up"
        ? z
            .string()
            .min(2, { message: "Last name must be at least 2 characters long" })
            .max(30, { message: "Last name must not exceed 30 characters" })
        : z.string().optional(),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password:
      type !== "reset-password"
        ? z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(128, { message: "Password must not exceed 128 characters" })
        : z.string().optional(),

    rememberMe: z.boolean().optional(),
    acceptTerms:
      type === "sign-up"
        ? z.boolean().refine((val) => val === true, {
            message: "You must accept the terms and conditions",
          })
        : z.boolean().optional(),
  });
};
