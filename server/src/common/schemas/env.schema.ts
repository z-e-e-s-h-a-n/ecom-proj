import { z } from "zod";

export const envSchema = z.object({
  // ==============================
  // App Config
  // ==============================
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_PORT: z.coerce.number().default(5000),
  APP_ENDPOINT: z.string(),
  CORS_ORIGIN: z.string(),

  // ==============================
  // Database
  // ==============================
  DB_URI: z.string(),

  // ==============================
  // OTP Model
  // ==============================
  OTP_EXP: z.string(),

  // ==============================
  // Auth
  // ==============================
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXP: z.string(),
  REFRESH_TOKEN_EXP: z.string(),

  // ==============================
  // OAuth Providers
  // ==============================
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  FACEBOOK_CLIENT_ID: z.string(),
  FACEBOOK_CLIENT_SECRET: z.string(),
  FACEBOOK_CALLBACK_URL: z.string(),

  // ==============================
  // SMS (Twilio)
  // ==============================
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),

  // ==============================
  // Email (Resend)
  // ==============================
  RESEND_API_KEY: z.string(),

  // ==============================
  // API Keys
  // ==============================
  IP_STACK_API_KEY: z.string(),

  // ==============================
  // Admin
  // ==============================
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PHONE: z.string(),
});

export function validateEnv(config: Record<string, any>) {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export type EnvSchema = z.infer<typeof envSchema>;
