import mongoose from "mongoose";
import envConfig from "@/config/env";
import logger from "@/config/logger";

const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.db.uri);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", { error });
    process.exit(1);
  }
};

export default connectDB;
