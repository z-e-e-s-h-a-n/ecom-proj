import express, { Application } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import passport from "@/config/passport";
import corsMiddleware from "@/middlewares/cors";
import authRoutes from "@/routes/auth";
import userRoutes from "@/routes/user";
import errorHandler from "@/middlewares/errorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(compression());
app.use(corsMiddleware);
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (_, res) => {
  res.json({ message: "Welcome to NoSha e-commerce API!" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

export default app;
