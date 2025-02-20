import { Router } from "express";
import passport from "passport";
import envConfig from "@/config/env";
import * as controller from "@/controllers/auth";
import { createAuthSession, sendResponse } from "@/lib/utils/helper";

const router: Router = Router();
const failureRedirect = `${envConfig.client.endpoint}/login`;
const successRedirect = `${envConfig.client.endpoint}`;

router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/logout", controller.logout);
router.post("/request-otp", controller.requestOtp);
router.get("/validate-otp", controller.validateOtp);
router.post("/reset-password", controller.resetPassword);

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
      const tokenData = await createAuthSession(req, res, req.user);
      if (tokenData) res.redirect(successRedirect);
    } else {
      sendResponse(res, 404, "Authentication failed.");
    }
  }
);

// Facebook Auth Routes
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect }),
  async (req, res) => {
    if (req.user) {
      const tokenData = await createAuthSession(req, res, req.user);
      if (tokenData) res.redirect(successRedirect);
    } else {
      sendResponse(res, 404, "Authentication failed.");
    }
  }
);

export default router;
