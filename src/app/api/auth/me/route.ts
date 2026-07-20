import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { AuthenticationError } from "@/errors/authentication.error";
import { SESSION_COOKIE_NAME } from "@/utils/auth";

export async function GET() {
  try {
    const user = await requireUser();

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE_NAME);
    }

    return handleApiError(error);
  }
}