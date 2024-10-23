import { z } from "zod";

export const LogInSchema = z.object({
  email: z.string().email("Valid email.").trim(),
  password: z.string().trim(),
});
