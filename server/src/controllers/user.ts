import UserModel from "@/models/user";
import logger from "@/utils/logger";
import { prepareUserResponse } from "@/utils/user";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    await prepareUserResponse(res, user, "User fetched successfully.");
  } catch (error) {
    logger.error("Error fetching user profile:", { error });
    res.status(500).json({ message: "Error fetching user profile" });
  }
};
