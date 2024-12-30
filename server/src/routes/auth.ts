import { Router } from "express";
import passport from "passport";
import envConfig from "@/config/envConfig";
import { prepareUserResponse } from "@/utils/user";
import {
  signup,
  login,
  verifyEmail,
  logout,
  resetPassword,
  requestOtp,
} from "@/controllers/auth";

const router: Router = Router();
const failureRedirect = `${envConfig.client.endpoint}/auth/login`;

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/request-otp", requestOtp);
router.get("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);

// Google Auth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect }),
  async (req, res) => {
    if (req.user) {
      await prepareUserResponse(
        res,
        req.user,
        "Google authentication successful."
      );
    } else {
      res.status(400).json({ message: "Authentication failed." });
    }
  }
);

// Facebook Auth Routes
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
    scope: ["profile", "email"],
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect }),
  async (req, res) => {
    if (req.user) {
      await prepareUserResponse(
        res,
        req.user,
        "Facebook authentication successful."
      );
    } else {
      res.status(400).json({ message: "Authentication failed." });
    }
  }
);

export default router;
