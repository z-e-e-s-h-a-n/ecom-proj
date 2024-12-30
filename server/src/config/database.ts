import mongoose from "mongoose";
import envConfig from "@/config/envConfig";

const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.db.uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
