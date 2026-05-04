import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDb } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import cabRoutes from "./routes/cabRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

if (!MONGO_URI) {
  console.error("MONGO_URI is required");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required");
  process.exit(1);
}

await connectDb(MONGO_URI);

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: CLIENT_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/cabs", cabRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Cab booking API listening on port ${PORT}`);
});
