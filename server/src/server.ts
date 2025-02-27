import dotenv from "dotenv";
dotenv.config();
import app from "@/app";
import connectDB from "@/config/database";
import envConfig from "@/config/env";
import logger from "@/config/logger";

const PORT = envConfig.app.port;
connectDB();

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

export { app, server };
