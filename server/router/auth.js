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

import { passwordLimiter, resendLimiter } from "../utils/localLimiter.js";
import { validateResetPassword } from "../middleware/validateResetPassword.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/refreshToken").get(refreshToken);
router.route("/logout").post(logout);
router.route("/verification/:verificationId").get(verification);
router.route("/forgotPassword").post(forgotPassword);
router
  .route("/resetPassword/:verificationId")
  .post(validateResetPassword, passwordLimiter, resetPassword);
router.route("/resendVerification").post(resendLimiter, resendVerification);
router
  .route("/resendPasswordVerification")
  .post(resendLimiter, resendPasswordVerification);

export default router;
