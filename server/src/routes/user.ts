import { Router } from "express";
import { authenticateUser } from "@/middlewares/auth";
import { getUser } from "@/controllers/user";

const router: Router = Router();

router.get("/profile", authenticateUser, getUser);

export default router;
