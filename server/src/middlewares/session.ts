import session from "express-session";
import envConfig from "@/config/envConfig";
import { NextFunction, Request, Response } from "express";

export const sessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return session({
    secret: envConfig.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      sameSite: "strict",
      secure: envConfig.env === "production",
    },
  })(req, res, next);
};
