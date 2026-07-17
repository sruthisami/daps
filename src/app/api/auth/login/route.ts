import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { authService } from "@/services/auth.service";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/utils/auth";
import { loginSchema } from "@/validations/auth.validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const { token, user } = await authService.login(data);

    const cookieStore = await cookies();

    cookieStore.set(
      SESSION_COOKIE_NAME,
      token,
      SESSION_COOKIE_OPTIONS
    );

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}