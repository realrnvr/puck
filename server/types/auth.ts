import type { Request } from "express";

export interface AuthUser {
  userId: string;
  email?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
