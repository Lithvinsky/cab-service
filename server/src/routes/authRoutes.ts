import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as auth from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", limiter, auth.register);
router.post("/login", limiter, auth.login);
router.get("/me", authenticate, auth.me);

export default router;
