import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { authService } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/utils/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await authService.logout(token);
    }

    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json(
      {
        message: "Logged out successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}