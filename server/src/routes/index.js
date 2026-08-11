import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { register, login, me } from "../controllers/auth.controller.js";
import { createScore, getRecord } from "../controllers/score.controller.js";
import { getHistory, getProgress } from "../controllers/history.controller.js";
import { getReport } from "../controllers/report.controller.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, me);

// Scoring
router.post("/score", requireAuth, createScore);
router.get("/submissions/:id", requireAuth, getRecord);

// History
router.get("/history", requireAuth, getHistory);
router.get("/history/progress", requireAuth, getProgress);

// Reports
router.get("/report/:id", requireAuth, getReport);

export default router;

