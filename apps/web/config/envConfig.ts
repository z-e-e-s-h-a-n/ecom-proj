import { getEnv } from "@/lib/utils";

const envConfig = {
  env: getEnv("NODE_ENV", "development"),

  app: {
    endpoint: getEnv("APP_ENDPOINT", "http://localhost:3000"),
  },
  server: {
    endpoint: getEnv("SERVER_ENDPOINT", "http://localhost:4000"),
  },
};

export default envConfig;
