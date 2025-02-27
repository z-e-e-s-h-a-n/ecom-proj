import envConfig from "@/config/env";
import logger from "@/config/logger";
import { sendResponse } from "@/lib/utils/helper";
import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
  status?: number;
  isOperational?: boolean;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred";

  const isOperational = err.isOperational ?? false;

  logger.error(`[ERROR] ${req.method} ${req.url}: ${message}`, {
    stack: err.stack,
    isOperational,
  });

  sendResponse(res, status, message, {
    stack: envConfig.env === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
