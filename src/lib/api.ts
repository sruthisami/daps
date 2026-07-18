import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AppError } from "@/errors/app.error";

export function handleApiError(error: unknown): NextResponse {
  console.error(error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: error.statusCode,
      },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: error.flatten(),
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json(
    {
      error: "Internal server error.",
    },
    {
      status: 500,
    },
  );
}