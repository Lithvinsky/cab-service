import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { Booking } from "../models/Booking.js";
import { Cab } from "../models/Cab.js";
import { BookingStatus } from "../types/enums.js";
import { sendSuccess } from "../utils/response.js";
import { analyticsQuerySchema } from "../utils/validation.js";
import { endOfUtcDay, startOfUtcDay } from "../utils/dateUtils.js";

export async function summary(req: AuthRequest, res: Response) {
  const q = analyticsQuerySchema.parse(req.query);
  const from = startOfUtcDay(new Date(q.from));
  const to = endOfUtcDay(new Date(q.to));

  const bookingsPerDay = await Booking.aggregate([
    {
      $match: {
        date: { $gte: from, $lte: to },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "UTC" },
        },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: "$_id", total: 1, _id: 0 } },
  ]);

  const totalBookings = await Booking.countDocuments({
    date: { $gte: from, $lte: to },
    status: { $ne: BookingStatus.CANCELLED },
  });

  const cancellations = await Booking.countDocuments({
    status: BookingStatus.CANCELLED,
    updatedAt: { $gte: from, $lte: to },
  });

  const cabs = await Cab.find({}).lean();
  const utilizationPerCab: Array<{
    cabId: string;
    registrationNumber: string;
    capacity: number;
    bookings: number;
    tripInstances: number;
    utilizationPct: number;
  }> = [];

  for (const cab of cabs) {
    const bookings = await Booking.find({
      cab: cab._id,
      date: { $gte: from, $lte: to },
      status: { $nin: [BookingStatus.CANCELLED] },
    }).lean();

    if (bookings.length === 0) {
      utilizationPerCab.push({
        cabId: String(cab._id),
        registrationNumber: cab.registrationNumber,
        capacity: cab.capacity,
        bookings: 0,
        tripInstances: 0,
        utilizationPct: 0,
      });
      continue;
    }

    const tripKeys = new Set(
      bookings.map((b) => {
        const d = new Date(b.date).toISOString().slice(0, 10);
        return `${d}_${b.timeSlot}`;
      })
    );
    const tripInstances = tripKeys.size;
    const maxSeats = tripInstances * cab.capacity;
    const utilizationPct =
      maxSeats > 0
        ? Math.round((bookings.length / maxSeats) * 10000) / 100
        : 0;

    utilizationPerCab.push({
      cabId: String(cab._id),
      registrationNumber: cab.registrationNumber,
      capacity: cab.capacity,
      bookings: bookings.length,
      tripInstances,
      utilizationPct: Math.min(100, utilizationPct),
    });
  }

  return sendSuccess(res, {
    from: q.from,
    to: q.to,
    totalBookings,
    cancellations,
    bookingsPerDay,
    utilizationPerCab,
  });
}
