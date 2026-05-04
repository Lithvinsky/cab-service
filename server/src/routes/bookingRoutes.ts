import { Router } from "express";
import * as bookings from "../controllers/bookingController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, bookings.createBooking);
router.get("/my", authenticate, bookings.myBookings);
router.get("/", authenticate, requireAdmin, bookings.listBookings);
router.put("/:id/cancel", authenticate, bookings.cancelBooking);
router.put("/:id/reassign", authenticate, requireAdmin, bookings.reassignBooking);

export default router;
