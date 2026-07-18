import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { authService } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/utils/auth";
import { SESSION_DURATION_MS } from "@/utils/session";
import { loginSchema } from "@/validations/auth.validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input = loginSchema.parse(body);

    const { token, user } = await authService.login(input);

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + SESSION_DURATION_MS),
    });

    return NextResponse.json(
      {
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}