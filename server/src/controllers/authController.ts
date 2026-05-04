import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { User } from "../models/User.js";
import type { AuthRequest } from "../middleware/auth.js";
import { UserRole } from "../types/enums.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { loginSchema, registerSchema } from "../utils/validation.js";

function signToken(userId: string, role: UserRole): string {
  const secret = process.env.JWT_SECRET!;
  const expires = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign({ sub: userId, role }, secret as Secret, {
    expiresIn: expires as SignOptions["expiresIn"],
  });
}

export async function register(req: AuthRequest, res: Response) {
  const domain = process.env.CORPORATE_EMAIL_DOMAIN ?? "company.com";
  const body = registerSchema(domain).parse(req.body);

  const exists = await User.findOne({ email: body.email });
  if (exists) {
    return sendError(res, "Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await User.create({
    name: body.name,
    email: body.email,
    passwordHash,
    role: UserRole.EMPLOYEE,
    department: body.department,
  });

  const token = signToken(user.id, UserRole.EMPLOYEE);
  return sendSuccess(
    res,
    { user: user.toJSON(), token },
    201,
    "Registered successfully"
  );
}

export async function login(req: AuthRequest, res: Response) {
  const body = loginSchema.parse(req.body);
  const user = await User.findOne({ email: body.email }).select("+passwordHash");
  if (!user) {
    return sendError(res, "Invalid credentials", 401);
  }
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) {
    return sendError(res, "Invalid credentials", 401);
  }

  const token = signToken(user.id, user.role);
  return sendSuccess(res, { user: user.toJSON(), token });
}

export async function me(req: AuthRequest, res: Response) {
  const uid = req.user?.sub;
  if (!uid) {
    return sendError(res, "Unauthorized", 401);
  }
  const user = await User.findById(uid);
  if (!user) {
    return sendError(res, "User not found", 404);
  }
  return sendSuccess(res, { user: user.toJSON() });
}
