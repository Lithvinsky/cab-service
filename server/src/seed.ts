import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";
import { Driver } from "./models/Driver.js";
import { Route } from "./models/Route.js";
import { Cab } from "./models/Cab.js";
import { Booking } from "./models/Booking.js";
import { UserRole, CabStatus, DriverStatus, BookingStatus, TimeSlot } from "./types/enums.js";
import { normalizeBookingDate } from "./utils/dateUtils.js";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI required");
  process.exit(1);
}

await connectDb(MONGO_URI);

console.log("Clearing collections...");
await Promise.all([
  Booking.deleteMany({}),
  Cab.deleteMany({}),
  Route.deleteMany({}),
  Driver.deleteMany({}),
  User.deleteMany({}),
]);

const passwordHash = await bcrypt.hash("Password123!", 12);

const admin = await User.create({
  name: "Transport Admin",
  email: "admin@company.com",
  passwordHash,
  role: UserRole.ADMIN,
  department: "Transport",
});

const e1 = await User.create({
  name: "Alice Employee",
  email: "alice@company.com",
  passwordHash,
  role: UserRole.EMPLOYEE,
  department: "Engineering",
});

const e2 = await User.create({
  name: "Bob Employee",
  email: "bob@company.com",
  passwordHash,
  role: UserRole.EMPLOYEE,
  department: "Sales",
});

const d1 = await Driver.create({
  name: "John Driver",
  phone: "+1-555-0101",
  licenseNumber: "DL-10001",
  status: DriverStatus.ACTIVE,
});

const d2 = await Driver.create({
  name: "Jane Driver",
  phone: "+1-555-0102",
  licenseNumber: "DL-10002",
  status: DriverStatus.ACTIVE,
});

const r1 = await Route.create({
  name: "North Campus Loop",
  description: "Residential north zone to HQ",
  pickupAreas: ["North Gate", "Metro Station A"],
});

const r2 = await Route.create({
  name: "South Industrial",
  description: "South warehouses to HQ",
  pickupAreas: ["South Hub", "Plant B"],
});

const tomorrow = new Date();
tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

const cab1 = await Cab.create({
  registrationNumber: "XYZ-1001",
  capacity: 4,
  status: CabStatus.ACTIVE,
  assignedDriver: d1._id,
  currentRoute: r1._id,
});

await Cab.create({
  registrationNumber: "XYZ-1002",
  capacity: 6,
  status: CabStatus.ACTIVE,
  assignedDriver: d2._id,
  currentRoute: r1._id,
});

const day1 = normalizeBookingDate(tomorrow.toISOString().slice(0, 10));

await Booking.create({
  employee: e1._id,
  cab: cab1._id,
  route: r1._id,
  pickupLocation: "North Gate",
  dropLocation: "HQ Tower",
  date: day1,
  timeSlot: TimeSlot.MORNING,
  status: BookingStatus.CONFIRMED,
});

await Booking.create({
  employee: e2._id,
  cab: cab1._id,
  route: r1._id,
  pickupLocation: "Metro Station A",
  dropLocation: "HQ Tower",
  date: day1,
  timeSlot: TimeSlot.MORNING,
  status: BookingStatus.CONFIRMED,
});

await Booking.create({
  employee: e2._id,
  route: r1._id,
  cab: null,
  pickupLocation: "North Gate",
  dropLocation: "HQ Tower",
  date: day1,
  timeSlot: TimeSlot.EVENING,
  status: BookingStatus.PENDING,
});

console.log(`
Seed complete.
Admin:  admin@company.com / Password123!
Employee: alice@company.com, bob@company.com / Password123!
Corporate domain for new signups: ${process.env.CORPORATE_EMAIL_DOMAIN ?? "company.com"}
`);
process.exit(0);
