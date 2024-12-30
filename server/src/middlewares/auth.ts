import { Request, Response, NextFunction } from "express";
import {
  verifyJwtToken,
  attachDecodedUser,
  handleTokenRefresh,
} from "@/utils/jwt";
import logger from "@/utils/logger";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      logger.warn("Authorization token is missing");
      res.status(401).json({ message: "Authorization token missing." });
      return;
    }

    const decoded = verifyJwtToken(accessToken, "JWT_ACCESS_SECRET");
    if (decoded) {
      attachDecodedUser(req, decoded);
      logger.info("Access token validated successfully");
      next();
      return;
    }

    logger.warn("Authorization token is invalid or expired");
    req.user = await handleTokenRefresh(req, res);
    next();
  } catch (error: any) {
    logger.error("Error authenticating token", { error: error.message });
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
