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
  otpCheckForgot,
  otpCheckLogin,
  register,
  sendCodeOtp,
  updatePassword,
} from "../controllers/auth-controller.js";
import { validate } from "../middlware/validate.js";
import {
  LoginLimiter,
  otpLimiter,
  registerLimiter,
} from "../middlware/rate-limit.js";
const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", LoginLimiter, validate(loginSchema), login);
router.post("/codeOtp", otpLimiter, validate(otpSchema), otpCheckLogin);
router.post("/resendCode", otpLimiter, validate(resendCode), sendCodeOtp);
router.post("/forgotOtp", otpLimiter, validate(otpSchema), otpCheckForgot);
router.post("/changePassword" , registerLimiter , validate(changePasswordSchema) , updatePassword)

export default router;
