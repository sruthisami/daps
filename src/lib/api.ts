import { NextResponse } from "next/server";
import { AppError } from "@/errors/app.error";

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  console.error(error);

  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}