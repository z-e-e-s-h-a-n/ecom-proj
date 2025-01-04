import { Request, Response, NextFunction } from "express";
import {
  verifyJwtToken,
  attachDecodedUser,
  handleTokenRefresh,
} from "@/utils/jwt";
import logger from "@/utils/logger";
import { sendResponse } from "@/utils/helper";

export const authGuard = (role: string = "user") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        logger.warn("Missing access token");
        return sendResponse(res, 401, false, "Authorization token missing.");
      }

      const decoded = verifyJwtToken(accessToken, "JWT_ACCESS_SECRET");
      if (decoded) {
        attachDecodedUser(req, decoded);
      } else {
        logger.warn("Access token invalid or expired. Attempting refresh...");
        await handleTokenRefresh(req, res);
      }

      if (!req.user) {
        logger.error("User not attached after token handling.");
        return sendResponse(res, 404, false, "User not found");
      }

      if (req?.user?.role !== role) {
        logger.warn("Role mismatch. Access denied.");
        return sendResponse(
          res,
          403,
          false,
          `Forbidden: Requires ${role} access.`
        );
      }

      next();
    } catch (error: any) {
      logger.error("Authentication failed", { error: error.message });
      sendResponse(res, 401, false, "Unauthorized: Invalid or expired token.");
    }
  };
};
