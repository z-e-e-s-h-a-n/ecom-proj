import dotenv from "dotenv";
dotenv.config();
import app from "@/app";
import connectDB from "@/config/database";
import envConfig from "@/config/envConfig";

const PORT = envConfig.app.port;
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app };
