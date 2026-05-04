import { Router } from "express";
import * as drivers from "../controllers/driverController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireAdmin, drivers.createDriver);
router.get("/", authenticate, drivers.listDrivers);
router.put("/:id", authenticate, requireAdmin, drivers.updateDriver);
router.delete("/:id", authenticate, requireAdmin, drivers.deleteDriver);

export default router;
