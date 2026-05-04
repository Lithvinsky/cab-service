import mongoose, { Schema, type Document, type Types, type Model } from "mongoose";

export interface IRoute extends Document {
  name: string;
  description: string;
  pickupAreas: string[];
  createdAt: Date;
}

const routeSchema = new Schema<IRoute>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    pickupAreas: [{ type: String, trim: true }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type RouteId = Types.ObjectId;
export const Route: Model<IRoute> =
  mongoose.models.Route ?? mongoose.model<IRoute>("Route", routeSchema);
