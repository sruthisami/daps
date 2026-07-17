import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { authService } from "@/services/auth.service";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/utils/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await authService.logout(token);
    }

    cookieStore.delete({
      name: SESSION_COOKIE_NAME,
      path: SESSION_COOKIE_OPTIONS.path,
    });

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    return handleApiError(error);
  }
}