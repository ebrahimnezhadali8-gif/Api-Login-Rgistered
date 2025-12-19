import express from "express";
import { loginSchema, otpSchema, registerSchema } from "../validators/auth.schema.js";
import { login, otpCheck, register } from "../controllers/auth-controller.js";
import { validate } from "../middlware/validate.js";
import { LoginLimiter, otpLimiter, registerLimiter } from "../middlware/rate-limit.js";
const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", LoginLimiter, validate(loginSchema), login);
router.post("/codeOtp" , otpLimiter , validate(otpSchema) , otpCheck)

export default router;
