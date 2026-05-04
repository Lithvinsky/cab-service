import { Router } from "express";
import * as analytics from "../controllers/analyticsController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/summary", authenticate, requireAdmin, analytics.summary);

export default router;
