import dotenv from "dotenv";
dotenv.config();
import app from "@/app";
import connectDB from "@/config/database";
import envConfig from "@/config/envConfig";

const PORT = envConfig.app.port;
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

export { app, server };
