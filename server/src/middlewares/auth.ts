import { Request, Response, NextFunction } from "express";
import {
  verifyJwtToken,
  attachDecodedUser,
  handleTokenRefresh,
} from "@/utils/jwt";
import logger from "@/config/logger";
import { sendResponse } from "@/utils/helper";
import { UserRole } from "@/models/user";

export const authGuard = (role: UserRole = "customer") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if (accessToken) {
        const decoded = verifyJwtToken(accessToken, "JWT_ACCESS_SECRET");
        if (decoded) attachDecodedUser(req, decoded);
      } else if (refreshToken) {
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
