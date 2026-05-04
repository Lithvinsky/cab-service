import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { UserRole } from "../types/enums.js";
import { sendSuccess } from "../utils/response.js";

export async function listUsers(req: AuthRequest, res: Response) {
  const { role, email, department } = req.query as Record<string, string | undefined>;
  const q: Record<string, unknown> = {};
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    q.role = role;
  }
  if (email) {
    q.email = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }
  if (department) {
    q.department = new RegExp(department.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }
  const users = await User.find(q).sort({ createdAt: -1 }).limit(500);
  return sendSuccess(res, { users });
}
