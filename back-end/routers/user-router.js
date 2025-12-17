import express from "express";
import { registerSchema } from "../validators/auth.schema.js";
import { register } from "../controllers/auth-controller.js";
import { validate } from "../middlware/validate.js";
import { registerLimiter } from "../middlware/rate-limit.js";

const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);

export default router;
