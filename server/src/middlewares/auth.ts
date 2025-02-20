import { Request, Response, NextFunction } from "express";
import {
  verifyJwtToken,
  attachDecodedUser,
  handleTokenRefresh,
} from "@/lib/utils/jwt";
import logger from "@/config/logger";
import { sendResponse } from "@/lib/utils/helper";
import { UserRole } from "@/models/user";

export const authGuard = (role: UserRole, isAuth = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if (accessToken) {
        const decoded = verifyJwtToken(accessToken, "JWT_ACCESS_SECRET");
        if (decoded) attachDecodedUser(req, decoded);
      } else if (refreshToken) {
        await handleTokenRefresh(req, res);
      }

      if (!req.user) return sendResponse(res, 404, "User not found");

      if (isAuth && !req?.user?.isAuth) {
        logger.error("User not authorized.", { user: req?.user });
        return sendResponse(res, 403, "Access denied.");
      }

      if (req?.user?.role !== role) {
        logger.warn("Access denied.");
        return sendResponse(res, 403, `Forbidden: Requires ${role} access.`);
      }

      next();
    } catch (error: any) {
      logger.error("Authentication failed", { error: error.message });
      sendResponse(res, 401, "Unauthorized: Invalid or expired token.");
    }
  };
};
