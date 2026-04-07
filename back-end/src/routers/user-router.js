import express from "express";
import { auth, roleAuth } from "../middlware/auth.js";
import { getUserMe } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/me", auth, roleAuth("admin"), getUserMe);

export default router;
