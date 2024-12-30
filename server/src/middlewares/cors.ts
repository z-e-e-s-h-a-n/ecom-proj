import cors from "cors";
import envConfig from "@/config/envConfig";
const corsOptions = {
  origin: envConfig.client.endpoint,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
