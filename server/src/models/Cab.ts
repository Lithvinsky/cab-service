import mongoose, { Schema, type Document, type Types, type Model } from "mongoose";
import { CabStatus } from "../types/enums.js";

export interface ICab extends Document {
  registrationNumber: string;
  capacity: number;
  status: CabStatus;
  assignedDriver: Types.ObjectId | null;
  currentRoute: Types.ObjectId | null;
  createdAt: Date;
}

const cabSchema = new Schema<ICab>(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: Object.values(CabStatus),
      default: CabStatus.ACTIVE,
    },
    assignedDriver: { type: Schema.Types.ObjectId, ref: "Driver", default: null },
    currentRoute: { type: Schema.Types.ObjectId, ref: "Route", default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Cab: Model<ICab> = mongoose.models.Cab ?? mongoose.model<ICab>("Cab", cabSchema);
