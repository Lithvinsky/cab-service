import { Router } from "express";
import * as cabs from "../controllers/cabController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireAdmin, cabs.createCab);
router.get("/", authenticate, cabs.listCabs);
router.get("/:id", authenticate, cabs.getCab);
router.put("/:id", authenticate, requireAdmin, cabs.updateCab);
router.delete("/:id", authenticate, requireAdmin, cabs.deleteCab);

export default router;
