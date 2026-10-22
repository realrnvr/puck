import { z } from "zod";

export const EmailSchema = z.object({
  email: z.string().email("Valid email.").trim(),
});

export type EmailFormValues = z.infer<typeof EmailSchema>;
