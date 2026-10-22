import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequestError.js";

interface ResetPasswordBody {
  newPassword?: string;
  confirmPassword?: string;
}

export const validateResetPassword = (
  req: Request<{}, {}, ResetPasswordBody>,
  _res: Response,
  next: NextFunction,
): void => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    throw new BadRequestError("Please provide credentials!");
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError("Passwords does not match!");
  }

  next();
};
