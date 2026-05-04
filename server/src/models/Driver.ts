import mongoose, { Schema, type Document, type Model } from "mongoose";
import { DriverStatus } from "../types/enums.js";

export interface IDriver extends Document {
  name: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
  createdAt: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true, unique: true },
    status: {
      type: String,
      enum: Object.values(DriverStatus),
      default: DriverStatus.ACTIVE,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Driver: Model<IDriver> =
  mongoose.models.Driver ?? mongoose.model<IDriver>("Driver", driverSchema);
