import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { documentService } from "@/services/document.service";
import { actionDocumentSchema } from "@/validations/document.validation";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const actor = await requireUser();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Request body must be valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const input = actionDocumentSchema.parse(body);

    const { id } = await params;

    const document = await documentService.archive(
      id,
      input.expectedVersion,
      actor,
    );

    return NextResponse.json(document);
  } catch (error) {
    return handleApiError(error);
  }
}