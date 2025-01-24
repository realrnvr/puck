import { z } from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(4, "At least 4 characters")
    .max(50, "Cannot exceed 50 characters")
    .trim()
    .regex(/^[a-zA-Z0-9._]+$/, {
      message: "Only letters, numbers, dots, and underscores allowed.",
    })
    .refine((val) => !val.startsWith(".") && !val.startsWith("_"), {
      message: "Cannot start with a dot or underscore",
    })
    .refine((val) => !val.endsWith(".") && !val.endsWith("_"), {
      message: "Cannot end with a dot or underscore",
    }),
  email: z.string().email("Valid email.").trim(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .trim()
    .regex(/[A-Z]/, "At least one Uppercase letter")
    .regex(/[a-z]/, "At least one Lowercase letter")
    .regex(/\d/, "At least one Digit")
    .regex(/[\W_]/, "At least one Special character"),
});
