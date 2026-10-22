import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/auth.js";

interface AccessTokenPayload extends JwtPayload {
  userId?: string;
  email?: string;
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = req.headers.authorization;
  const [scheme, accessToken] = authHeader?.split(" ") ?? [];

  if (scheme !== "Bearer" || !accessToken) {
    return res.status(401).json({
      message: "Authentication required.",
      type: "unauthenticated",
    });
  }

  try {
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as AccessTokenPayload;

    if (!payload?.userId) {
      throw new Error("Invalid access token payload");
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token.",
      type: "unauthenticated",
    });
  }
};
