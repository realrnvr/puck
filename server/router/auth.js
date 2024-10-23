import express from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  resendPasswordVerification,
  resendVerification,
  resetPassword,
  signup,
  verification,
} from "../controller/auth.js";

import { resendLimiter } from "../utils/limiter/localLimiter.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/refreshToken").get(refreshToken);
router.route("/logout").post(logout);
router.route("/verification/:verificationId").get(verification);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:verificationId").post(resetPassword);
router.route("/resendVerification").post(resendLimiter, resendVerification);
router.route("/resendPasswordVerification").post(resendPasswordVerification);

export default router;
