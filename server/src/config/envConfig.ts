import { getEnv } from "@/utils/helper";

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
  nodemailer: {
    host: getEnv("EMAIL_HOST"),
    port: Number(getEnv("EMAIL_PORT")),
    user: getEnv("EMAIL_USER"),
    pass: getEnv("EMAIL_PASS"),
    from: getEnv("EMAIL_FROM"),
  },
  session: {
    secret: getEnv("SESSION_SECRET"),
  },
  db: {
    uri: getEnv("MONGO_URI"),
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
