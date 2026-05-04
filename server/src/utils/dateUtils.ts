/** Normalize to UTC midnight for the calendar day of `input` (ISO date string or Date). */
export function normalizeBookingDate(input: string | Date): Date {
  const d = typeof input === "string" ? new Date(input) : new Date(input);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date");
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

export function endOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
}
