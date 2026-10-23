import { z } from "zod";

export const PasswordSchema = z.object({
  password: z
    .string()
    .min(8, "At least 8 characters")
    .trim()
    .regex(/[A-Z]/, "At least one Uppercase letter")
    .regex(/[a-z]/, "At least one Lowercase letter")
    .regex(/\d/, "At least one Digit")
    .regex(/[\W_]/, "At least one Special character"),
});
