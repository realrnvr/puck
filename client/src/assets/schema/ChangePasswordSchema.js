import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "At least 8 characters").trim(),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .trim()
      .regex(/[A-Z]/, "At least one Uppercase letter")
      .regex(/[a-z]/, "At least one Lowercase letter")
      .regex(/\d/, "At least one Digit")
      .regex(/[\W_]/, "At least one Special character"),
    confirmNewPassword: z.string().min(8, "At least 8 characters").trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  });
