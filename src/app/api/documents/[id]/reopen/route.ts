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

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const actor = await requireUser();

    const body = await request.json();
    const input = actionDocumentSchema.parse(body);

    const { id } = await params;

    const document = await documentService.reopen(
      id,
      input.expectedVersion,
      actor,
    );

    return NextResponse.json(document);
  } catch (error) {
    return handleApiError(error);
  }
}
