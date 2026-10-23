import { BadRequestError } from "../errors/badRequestError.js";

export const validateResetPassword = (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    throw new BadRequestError("Please provide credentials!");
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError("Passwords does not match!");
  }

  next();
};
