import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { Route } from "../models/Route.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { routeCreateSchema, routeUpdateSchema } from "../utils/validation.js";

export async function createRoute(req: AuthRequest, res: Response) {
  const body = routeCreateSchema.parse(req.body);
  const route = await Route.create(body);
  return sendSuccess(res, { route }, 201);
}

export async function listRoutes(_req: AuthRequest, res: Response) {
  const routes = await Route.find().sort({ name: 1 });
  return sendSuccess(res, { routes });
}

export async function updateRoute(req: AuthRequest, res: Response) {
  const body = routeUpdateSchema.parse(req.body);
  const route = await Route.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!route) {
    return sendError(res, "Route not found", 404);
  }
  return sendSuccess(res, { route });
}

export async function deleteRoute(req: AuthRequest, res: Response) {
  const route = await Route.findByIdAndDelete(req.params.id);
  if (!route) {
    return sendError(res, "Route not found", 404);
  }
  return sendSuccess(res, { message: "Route removed" });
}
