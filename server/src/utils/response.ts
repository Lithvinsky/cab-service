import type { Response } from "express";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
};

export function sendSuccess<T>(res: Response, data: T, status = 200, message?: string) {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
}

export function sendError(
  res: Response,
  message: string,
  status = 400,
  errors?: unknown
) {
  const body: ApiResponse = { success: false, message, errors };
  return res.status(status).json(body);
}
