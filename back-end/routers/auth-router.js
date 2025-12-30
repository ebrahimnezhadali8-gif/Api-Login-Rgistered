import express from "express";
import {
  changePasswordSchema,
  loginSchema,
  otpSchema,
  registerSchema,
  resendCode,
} from "../validators/auth.schema.js";
import {
  login,
  logout,
  otpCheckForgot,
  otpCheckLogin,
  refresh,
  register,
  sendCodeOtp,
  updatePassword,
} from "../controllers/auth-controller.js";
import { validate } from "../middlware/validate.js";
import {
  changePasswordLimiter,
  loginLimiter,
  otpForgotLimiter,
  otpLimiter,
  otpResendLimiter,
  registerLimiter,
  TokenLimiter,
} from "../middlware/rate-limit.js";
const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/codeOtp", otpLimiter, validate(otpSchema), otpCheckLogin);
router.post("/resendCode", otpResendLimiter, validate(resendCode), sendCodeOtp);
router.post("/forgotOtp", otpForgotLimiter, validate(otpSchema), otpCheckForgot);
router.post(
  "/changePassword",
  changePasswordLimiter,
  validate(changePasswordSchema),
  updatePassword
);
router.post("/refresh", TokenLimiter , refresh);
router.post("/logout", logout);

export default router;