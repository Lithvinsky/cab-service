import { Router } from "express";
import * as users from "../controllers/userController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, requireAdmin, users.listUsers);

export default router;
