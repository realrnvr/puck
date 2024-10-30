import { Router } from "express";
import {
  loginAuthOne,
  loginAuthTwo,
  loginGoogleAuthTwo,
  signup,
  refreshToken,
  logout,
  verification,
  forgotPassword,
  resetPassword,
  resendVerification,
  resendPasswordVerification,
  google,
  deleteUser,
} from "../controller/auth.js";

import { passwordLimiter, resendLimiter } from "../utils/localLimiter.js";
import { validateResetPassword } from "../middleware/validateResetPassword.js";

const router = Router();

router.route("/loginAuthOne").post(loginAuthOne);
router.route("/loginAuthTwo").post(loginAuthTwo);
router.route("/loginGoogleAuthTwo").post(loginGoogleAuthTwo);
router.route("/signup").post(signup);
router.route("/refreshToken").get(refreshToken);
router.route("/logout").post(logout);
router.route("/verification/:verificationId").post(verification);
router.route("/forgotPassword").post(forgotPassword);
router
  .route("/resetPassword/:verificationId")
  .post(validateResetPassword, passwordLimiter, resetPassword);
router.route("/resendVerification").post(resendLimiter, resendVerification);
router
  .route("/resendPasswordVerification")
  .post(resendLimiter, resendPasswordVerification);
router.route("/google").post(google);
router.route("/deleteUser").delete(deleteUser);

export default router;
