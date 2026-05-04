import { Router } from "express";
import * as routes from "../controllers/routeController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireAdmin, routes.createRoute);
router.get("/", authenticate, routes.listRoutes);
router.put("/:id", authenticate, requireAdmin, routes.updateRoute);
router.delete("/:id", authenticate, requireAdmin, routes.deleteRoute);

export default router;
