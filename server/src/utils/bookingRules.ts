import { BookingStatus } from "../types/enums.js";
import { normalizeBookingDate, startOfUtcDay } from "./dateUtils.js";

const DEFAULT_CUTOFF_HOURS = 2;

/**
 * Employee may cancel if booking is PENDING/CONFIRMED and now is before
 * (start of booking day minus CANCEL_CUTOFF_HOURS_BEFORE_DAY).
 */
export function canEmployeeCancel(
  bookingDate: Date,
  status: BookingStatus,
  now: Date = new Date(),
  cutoffHoursBeforeDay: number = DEFAULT_CUTOFF_HOURS
): { ok: boolean; reason?: string } {
  if (status === BookingStatus.CANCELLED) {
    return { ok: false, reason: "Already cancelled" };
  }
  if (status === BookingStatus.COMPLETED) {
    return { ok: false, reason: "Completed bookings cannot be cancelled" };
  }
  const dayStart = startOfUtcDay(normalizeBookingDate(bookingDate));
  const deadline = new Date(dayStart.getTime() - cutoffHoursBeforeDay * 60 * 60 * 1000);
  if (now >= deadline) {
    return {
      ok: false,
      reason: `Cancellation must be at least ${cutoffHoursBeforeDay} hours before the service day`,
    };
  }
  return { ok: true };
}
