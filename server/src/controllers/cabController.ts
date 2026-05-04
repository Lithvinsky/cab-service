import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { Cab } from "../models/Cab.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { cabCreateSchema, cabUpdateSchema } from "../utils/validation.js";

export async function createCab(req: AuthRequest, res: Response) {
  const body = cabCreateSchema.parse(req.body);
  const cab = await Cab.create({
    registrationNumber: body.registrationNumber,
    capacity: body.capacity,
    status: body.status,
    assignedDriver: body.assignedDriver || null,
    currentRoute: body.currentRoute || null,
  });
  return sendSuccess(res, { cab }, 201);
}

export async function listCabs(_req: AuthRequest, res: Response) {
  const cabs = await Cab.find()
    .populate("assignedDriver", "name phone licenseNumber status")
    .populate("currentRoute", "name description pickupAreas")
    .sort({ registrationNumber: 1 });
  return sendSuccess(res, { cabs });
}

export async function getCab(req: AuthRequest, res: Response) {
  const cab = await Cab.findById(req.params.id)
    .populate("assignedDriver")
    .populate("currentRoute");
  if (!cab) {
    return sendError(res, "Cab not found", 404);
  }
  return sendSuccess(res, { cab });
}

export async function updateCab(req: AuthRequest, res: Response) {
  const body = cabUpdateSchema.parse(req.body);
  const cab = await Cab.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  })
    .populate("assignedDriver")
    .populate("currentRoute");
  if (!cab) {
    return sendError(res, "Cab not found", 404);
  }
  return sendSuccess(res, { cab });
}

export async function deleteCab(req: AuthRequest, res: Response) {
  const cab = await Cab.findByIdAndDelete(req.params.id);
  if (!cab) {
    return sendError(res, "Cab not found", 404);
  }
  return sendSuccess(res, { message: "Cab removed" });
}
