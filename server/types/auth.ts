import type { Request } from "express";

export interface AuthUser {
  userId: string;
  email?: string;
}

export interface AuthRequest<
  P = Request["params"],
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Request["query"],
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: AuthUser;
}

export const requireAuthUser = (req: { user?: AuthUser }): AuthUser => {
  if (!req.user) {
    throw new Error("Authentication middleware did not run.");
  }

  return req.user;
};
