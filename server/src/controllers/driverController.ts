import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { Driver } from "../models/Driver.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { driverCreateSchema, driverUpdateSchema } from "../utils/validation.js";

export async function createDriver(req: AuthRequest, res: Response) {
  const body = driverCreateSchema.parse(req.body);
  const driver = await Driver.create(body);
  return sendSuccess(res, { driver }, 201);
}

export async function listDrivers(_req: AuthRequest, res: Response) {
  const drivers = await Driver.find().sort({ name: 1 });
  return sendSuccess(res, { drivers });
}

export async function updateDriver(req: AuthRequest, res: Response) {
  const body = driverUpdateSchema.parse(req.body);
  const driver = await Driver.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!driver) {
    return sendError(res, "Driver not found", 404);
  }
  return sendSuccess(res, { driver });
}

export async function deleteDriver(req: AuthRequest, res: Response) {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) {
    return sendError(res, "Driver not found", 404);
  }
  return sendSuccess(res, { message: "Driver removed" });
}
