import mongoose, { Schema, type Document, type Model } from "mongoose";
import { UserRole } from "../types/enums.js";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE,
    },
    department: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.set("toJSON", {
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    delete r.passwordHash;
    delete r.__v;
    return r;
  },
});

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
