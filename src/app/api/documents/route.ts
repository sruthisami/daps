import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { documentService } from "@/services/document.service";
import {
  createDocumentSchema,
  listDocumentsSchema,
} from "@/validations/document.validation";

export async function GET(request: NextRequest) {
  try {
    const actor = await requireUser();

    const query = listDocumentsSchema.parse({
      status: request.nextUrl.searchParams.get("status"),
    });

    const documents = await documentService.findDocumentsByStatus(
      query.status,
      actor,
    );

    return NextResponse.json(documents);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requireUser();

    const body = await request.json();

    const input = createDocumentSchema.parse(body);

    const document = await documentService.create(input, actor);

    return NextResponse.json(document, {
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}