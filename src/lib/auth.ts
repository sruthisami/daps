import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthenticationError } from "@/errors/authentication.error";
import { UserRole, type User } from "@/generated/prisma/client";
import { authService } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/utils/auth";

async function requireRole(role: UserRole): Promise<User> {
  const user = await requireUser();

  if (user.role !== role) {
    redirect("/forbidden");
  }

  return user;
}

export async function requireRoles(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/forbidden");
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