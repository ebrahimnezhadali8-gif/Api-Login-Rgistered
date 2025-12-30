import express from "express";
import { auth } from "../middlware/auth.js";
import { getUserMe } from "../controllers/user-controller.js";
const router = express.Router();

router.get("/me", auth, getUserMe);

export default router;
