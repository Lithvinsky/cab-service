import mongoose, { Schema, type Document, type Types, type Model } from "mongoose";
import { BookingStatus, TimeSlot } from "../types/enums.js";

export interface IBooking extends Document {
  employee: Types.ObjectId;
  cab: Types.ObjectId | null;
  route: Types.ObjectId;
  pickupLocation: string;
  dropLocation: string;
  date: Date;
  timeSlot: TimeSlot;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cab: { type: Schema.Types.ObjectId, ref: "Cab", default: null, index: true },
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true, index: true },
    pickupLocation: { type: String, required: true, trim: true },
    dropLocation: { type: String, required: true, trim: true },
    date: { type: Date, required: true, index: true },
    timeSlot: { type: String, enum: Object.values(TimeSlot), required: true, index: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ date: 1, timeSlot: 1, cab: 1, status: 1 });

export const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", bookingSchema);
