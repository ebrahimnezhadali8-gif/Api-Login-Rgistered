import express from "express";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";
import { login, register } from "../controllers/auth-controller.js";
import { validate } from "../middlware/validate.js";
import { LoginLimiter, registerLimiter } from "../middlware/rate-limit.js";
const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", LoginLimiter, validate(loginSchema), login);

export default router;
