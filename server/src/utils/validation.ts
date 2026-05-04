import { z } from "zod";
import { BookingStatus, CabStatus, DriverStatus, TimeSlot } from "../types/enums.js";

export function corporateEmailSchema(domain: string) {
  const d = domain.toLowerCase().replace(/^@/, "");
  return z
    .string()
    .email()
    .transform((s) => s.toLowerCase().trim())
    .refine((email) => email.endsWith(`@${d}`), {
      message: `Email must be a corporate address ending with @${d}`,
    });
}

export const registerSchema = (emailDomain: string) =>
  z.object({
    name: z.string().min(1).max(120),
    email: corporateEmailSchema(emailDomain),
    password: z.string().min(8).max(128),
    department: z.string().max(120).optional(),
  });

export const loginSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1),
});

export const cabCreateSchema = z.object({
  registrationNumber: z.string().min(2).max(20),
  capacity: z.coerce.number().int().min(1).max(64),
  status: z.nativeEnum(CabStatus).optional(),
  assignedDriver: z.string().optional().nullable(),
  currentRoute: z.string().optional().nullable(),
});

export const cabUpdateSchema = cabCreateSchema.partial();

export const driverCreateSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(5).max(32),
  licenseNumber: z.string().min(2).max(64),
  status: z.nativeEnum(DriverStatus).optional(),
});

export const driverUpdateSchema = driverCreateSchema.partial();

export const routeCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  pickupAreas: z.array(z.string().max(200)).optional(),
});

export const routeUpdateSchema = routeCreateSchema.partial();

export const bookingCreateSchema = z.object({
  route: z.string().min(1),
  pickupLocation: z.string().min(1).max(500),
  dropLocation: z.string().min(1).max(500),
  date: z.string().min(1),
  timeSlot: z.nativeEnum(TimeSlot),
});

export const bookingQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  route: z.string().optional(),
  cab: z.string().optional(),
  employee: z.string().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
});

export const analyticsQuerySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

export const reassignSchema = z.object({
  cabId: z.string().min(1),
});
