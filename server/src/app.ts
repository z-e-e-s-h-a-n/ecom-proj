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
import categoryRoutes from "@/routes/category";
import attributeRoutes from "@/routes/attribute";
import specsRoutes from "@/routes/specification";
import currencyRoutes from "@/routes/currency";
import reviewRoutes from "@/routes/review";
import errorHandler from "@/middlewares/error";
import shippingRoutes from "@/routes/shipping";
import { sendResponse } from "@/lib/utils/helper";
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
app.use("/users", authGuard("customer"), userRoutes);
app.use("/shipping", shippingRoutes);
app.use("/products/categories", categoryRoutes);
app.use("/products/attributes", attributeRoutes);
app.use("/products/specifications", specsRoutes);
app.use("/products/reviews", reviewRoutes);
app.use("/products/currency", currencyRoutes);
app.use("/products", productRoutes);

app.get("/", (_, res) => {
  sendResponse(res, 200, "Welcome to NoSha e-commerce API!");
});

app.use((_req, res) => {
  sendResponse(res, 404, "Route not found.");
});

app.use(errorHandler);

export default app;
