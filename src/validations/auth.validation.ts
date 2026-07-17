import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export type LoginInput = z.infer<typeof loginSchema>;