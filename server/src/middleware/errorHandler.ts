import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return sendError(res, "Validation failed", 422, err.flatten());
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  const status = message === "Internal server error" ? 500 : 400;
  return sendError(res, message, status);
}
