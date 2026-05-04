export enum UserRole {
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

/** Shift buckets for fleet planning; extend as needed. */
export enum TimeSlot {
  MORNING = "MORNING",
  EVENING = "EVENING",
}

export enum CabStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum DriverStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
