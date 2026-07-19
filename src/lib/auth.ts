import { cookies } from "next/headers";
import { AuthenticationError } from "@/errors/authentication.error";
import { AuthorizationError } from "@/errors/authorization.error";
import { UserRole, type User } from "@/generated/prisma/client";
import { authService } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/utils/auth";

async function requireRole(role: UserRole): Promise<User> {
  const user = await requireUser();

  if (user.role !== role) {
    throw new AuthorizationError("You are not authorized to access this page.");
  }

  return user;
}

export function requireAuthor() {
  return requireRole(UserRole.AUTHOR);
}

export function requireReviewer() {
  return requireRole(UserRole.REVIEWER);
}

export function requireAdmin() {
  return requireRole(UserRole.ADMIN);
}

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
