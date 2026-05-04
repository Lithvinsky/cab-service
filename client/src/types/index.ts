export type UserRole = "EMPLOYEE" | "ADMIN";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type TimeSlot = "MORNING" | "EVENING";
export type CabStatus = "ACTIVE" | "INACTIVE";
export type DriverStatus = "ACTIVE" | "INACTIVE";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt?: string;
}

export interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
}

export interface RouteDoc {
  _id: string;
  name: string;
  description: string;
  pickupAreas: string[];
}

export interface Cab {
  _id: string;
  registrationNumber: string;
  capacity: number;
  status: CabStatus;
  assignedDriver?: Driver | string | null;
  currentRoute?: RouteDoc | string | null;
}

export interface Booking {
  _id: string;
  employee: User | string;
  cab: Cab | string | null;
  route: RouteDoc | string;
  pickupLocation: string;
  dropLocation: string;
  date: string;
  timeSlot: TimeSlot;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
}
