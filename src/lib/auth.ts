import { cookies } from "next/headers";

import { AuthenticationError } from "@/errors/authentication.error";
import type { User } from "@/generated/prisma/client";
import { authService } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/utils/auth";

export async function requireUser(): Promise<User> {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    throw new AuthenticationError("Authentication required.");
  }

  return authService.authenticate(token);
}

export async function optionalUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await authService.authenticate(token);
  } catch {
    return null;
  }
}