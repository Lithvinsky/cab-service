import type { Types } from "mongoose";
import { Cab } from "../models/Cab.js";
import { Booking } from "../models/Booking.js";
import { BookingStatus, CabStatus, TimeSlot } from "../types/enums.js";
import { endOfUtcDay, startOfUtcDay } from "./dateUtils.js";

export async function countSeatsUsed(
  cabId: Types.ObjectId,
  date: Date,
  timeSlot: TimeSlot
): Promise<number> {
  const start = startOfUtcDay(date);
  const end = endOfUtcDay(date);
  return Booking.countDocuments({
    cab: cabId,
    date: { $gte: start, $lte: end },
    timeSlot,
    status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
  });
}

/**
 * Pick an active cab serving `routeId` with spare capacity for this date/slot.
 * Prefers cabs with more free seats (balances load loosely).
 */
export async function findCabForAllocation(
  routeId: Types.ObjectId,
  date: Date,
  timeSlot: TimeSlot
): Promise<InstanceType<typeof Cab> | null> {
  const cabs = await Cab.find({
    status: CabStatus.ACTIVE,
    currentRoute: routeId,
    assignedDriver: { $ne: null },
  }).sort({ capacity: -1 });

  let best: InstanceType<typeof Cab> | null = null;
  let bestFree = -1;

  for (const cab of cabs) {
    const used = await countSeatsUsed(cab._id, date, timeSlot);
    const free = cab.capacity - used;
    if (free > 0 && free > bestFree) {
      best = cab;
      bestFree = free;
    }
  }

  return best;
}
