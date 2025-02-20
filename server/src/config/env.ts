import { getEnv } from "@/lib/utils/helper";

const envConfig = {
  env: getEnv("NODE_ENV", "development"),
  jwt: {
    accessSecret: getEnv("JWT_ACCESS_SECRET"),
    refreshSecret: getEnv("JWT_REFRESH_SECRET"),
  },
  google: {
    clientId: getEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    callbackURL: "/auth/google/callback",
  },
  facebook: {
    clientId: getEnv("FACEBOOK_CLIENT_ID"),
    clientSecret: getEnv("FACEBOOK_CLIENT_SECRET"),
    callbackURL: "/auth/facebook/callback",
  },
  twilio: {
    accountSid: getEnv("TWILIO_ACCOUNT_SID"),
    authToken: getEnv("TWILIO_AUTH_TOKEN"),
    phone: getEnv("TWILIO_PHONE_NUMBER"),
  },
  nodemailer: {
    host: getEnv("EMAIL_HOST"),
    port: Number(getEnv("EMAIL_PORT")),
    user: getEnv("EMAIL_USER"),
    pass: getEnv("EMAIL_PASS"),
    from: getEnv("EMAIL_FROM"),
  },
  ipStack: {
    apiKey: getEnv("IP_STACK_API_KEY"),
  },
  db: {
    uri: getEnv("MONGO_URI"),
  },
  shippo: {
    key: getEnv("SHIPPO_API_KEY"),
    endpoint: getEnv("SHIPPO_ENDPOINT"),
  },
  app: {
    port: Number(getEnv("APP_PORT", "5000")),
    endpoint: getEnv("APP_ENDPOINT"),
  },
  client: {
    endpoint: getEnv("CLIENT_ENDPOINT"),
  },
};

export default envConfig;
