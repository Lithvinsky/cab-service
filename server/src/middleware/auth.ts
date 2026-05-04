import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/enums.js";
import { sendError } from "../utils/response.js";

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return sendError(res, "Authentication required", 401);
  }
  const token = header.slice(7).trim();
  if (!token) {
    return sendError(res, "Authentication required", 401);
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return sendError(res, "Server misconfiguration", 500);
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded.sub || !decoded.role) {
      return sendError(res, "Invalid token", 401);
    }
    req.user = decoded;
    next();
  } catch {
    return sendError(res, "Invalid or expired token", 401);
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== UserRole.ADMIN) {
    return sendError(res, "Admin access required", 403);
  }
  next();
}

export function requireEmployee(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== UserRole.EMPLOYEE) {
    return sendError(res, "Employee access required", 403);
  }
  next();
}
