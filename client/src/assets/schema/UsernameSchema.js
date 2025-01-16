import { z } from "zod";

export const UsernameSchema = z.object({
  newUsername: z
    .string()
    .min(4, "At least 4 characters")
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
});
