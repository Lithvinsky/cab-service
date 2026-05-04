import type { Response } from "express";
import type { Types } from "mongoose";
import type { AuthRequest } from "../middleware/auth.js";
import { Booking } from "../models/Booking.js";
import { Route } from "../models/Route.js";
import { Cab } from "../models/Cab.js";
import { UserRole } from "../types/enums.js";
import { BookingStatus, TimeSlot } from "../types/enums.js";
import { countSeatsUsed, findCabForAllocation } from "../utils/allocation.js";
import { canEmployeeCancel } from "../utils/bookingRules.js";
import { normalizeBookingDate, startOfUtcDay, endOfUtcDay } from "../utils/dateUtils.js";
import { sendError, sendSuccess } from "../utils/response.js";
import {
  bookingCreateSchema,
  bookingQuerySchema,
  reassignSchema,
} from "../utils/validation.js";

export async function createBooking(req: AuthRequest, res: Response) {
  if (req.user?.role !== UserRole.EMPLOYEE) {
    return sendError(res, "Only employees can create bookings this way", 403);
  }
  const body = bookingCreateSchema.parse(req.body);
  const route = await Route.findById(body.route);
  if (!route) {
    return sendError(res, "Route not found", 404);
  }

  let dateNorm: Date;
  try {
    dateNorm = normalizeBookingDate(body.date);
  } catch {
    return sendError(res, "Invalid date", 400);
  }

  const dup = await Booking.findOne({
    employee: req.user.sub,
    date: { $gte: startOfUtcDay(dateNorm), $lte: endOfUtcDay(dateNorm) },
    timeSlot: body.timeSlot,
    status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
  });
  if (dup) {
    return sendError(
      res,
      "You already have an active booking for this date and time slot",
      409
    );
  }

  const cab = await findCabForAllocation(
    route._id as Types.ObjectId,
    dateNorm,
    body.timeSlot as TimeSlot
  );

  const status = cab ? BookingStatus.CONFIRMED : BookingStatus.PENDING;
  const booking = await Booking.create({
    employee: req.user.sub,
    cab: cab?._id ?? null,
    route: route._id,
    pickupLocation: body.pickupLocation,
    dropLocation: body.dropLocation,
    date: dateNorm,
    timeSlot: body.timeSlot,
    status,
  });

  const populated = await Booking.findById(booking._id)
    .populate("cab")
    .populate("route")
    .populate("employee", "name email department");

  return sendSuccess(
    res,
    { booking: populated },
    201,
    cab
      ? "Booking confirmed and cab assigned"
      : "Booking pending — no cab available; transport team will assign"
  );
}

export async function myBookings(req: AuthRequest, res: Response) {
  const uid = req.user?.sub;
  if (!uid) {
    return sendError(res, "Unauthorized", 401);
  }
  const bookings = await Booking.find({ employee: uid })
    .populate("cab")
    .populate("route")
    .sort({ date: -1, timeSlot: 1 });
  return sendSuccess(res, { bookings });
}

export async function listBookings(req: AuthRequest, res: Response) {
  const q = bookingQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (q.from || q.to) {
    filter.date = {};
    if (q.from) {
      (filter.date as Record<string, Date>).$gte = startOfUtcDay(new Date(q.from));
    }
    if (q.to) {
      (filter.date as Record<string, Date>).$lte = endOfUtcDay(new Date(q.to));
    }
  }
  if (q.route) filter.route = q.route;
  if (q.cab) filter.cab = q.cab;
  if (q.employee) filter.employee = q.employee;
  if (q.status) filter.status = q.status;

  const bookings = await Booking.find(filter)
    .populate("employee", "name email department role")
    .populate("cab")
    .populate("route")
    .sort({ date: -1, createdAt: -1 })
    .limit(1000);
  return sendSuccess(res, { bookings });
}

export async function cancelBooking(req: AuthRequest, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return sendError(res, "Booking not found", 404);
  }

  const isAdmin = req.user?.role === UserRole.ADMIN;
  const isOwner = booking.employee.toString() === req.user?.sub;

  if (!isAdmin && !isOwner) {
    return sendError(res, "Forbidden", 403);
  }

  if (!isAdmin) {
    const cutoff = Number(process.env.CANCEL_CUTOFF_HOURS_BEFORE_DAY ?? 2);
    const check = canEmployeeCancel(booking.date, booking.status, undefined, cutoff);
    if (!check.ok) {
      return sendError(res, check.reason ?? "Cannot cancel", 400);
    }
  }

  if (
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.COMPLETED
  ) {
    return sendError(res, "Invalid status for cancellation", 400);
  }

  booking.status = BookingStatus.CANCELLED;
  await booking.save();

  const populated = await Booking.findById(booking._id)
    .populate("cab")
    .populate("route")
    .populate("employee", "name email");
  return sendSuccess(res, { booking: populated }, 200, "Booking cancelled");
}

export async function reassignBooking(req: AuthRequest, res: Response) {
  const body = reassignSchema.parse(req.body);
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return sendError(res, "Booking not found", 404);
  }

  const cab = await Cab.findById(body.cabId);
  if (!cab) {
    return sendError(res, "Cab not found", 404);
  }

  const used = await countSeatsUsed(cab._id, booking.date, booking.timeSlot as TimeSlot);
  const existingSameBooking = booking.cab?.toString() === cab.id ? 1 : 0;
  if (used - existingSameBooking >= cab.capacity) {
    return sendError(res, "Selected cab has no free seats for this slot", 400);
  }

  booking.cab = cab._id;
  booking.status =
    booking.status === BookingStatus.PENDING
      ? BookingStatus.CONFIRMED
      : booking.status;
  await booking.save();

  const populated = await Booking.findById(booking._id)
    .populate("cab")
    .populate("route")
    .populate("employee", "name email");
  return sendSuccess(res, { booking: populated }, 200, "Booking reassigned");
}
