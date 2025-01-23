import express, { Application } from "express";
import cors from "cors";
import corsOptions from "@/config/cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import passport from "@/config/passport";
import authRoutes from "@/routes/auth";
import userRoutes from "@/routes/user";
import productRoutes from "@/routes/product";
import fakerRoutes from "@/routes/faker";
import errorHandler from "@/middlewares/errorHandler";
import { sendResponse } from "@/utils/helper";
import { authGuard } from "@/middlewares/auth";

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(compression());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/users", authGuard(), userRoutes);
app.use("/products", productRoutes);
app.use("/faker", fakerRoutes);

app.get("/", (_, res) => {
  sendResponse(res, 200, true, "Welcome to NoSha e-commerce API!");
});

app.use((_req, res) => {
  sendResponse(res, 404, false, "Route not found.");
});

app.use(errorHandler);

export default app;
