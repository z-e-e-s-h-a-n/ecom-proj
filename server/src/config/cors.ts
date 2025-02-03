import envConfig from "@/config/env";

const corsOptions = {
  origin: envConfig.client.endpoint,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};

export default corsOptions;
