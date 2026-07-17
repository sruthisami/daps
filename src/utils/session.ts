import { randomBytes, createHash } from "crypto";

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}