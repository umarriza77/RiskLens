import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { register, login, me } from "../controllers/auth.controller.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, me);

export default router;

