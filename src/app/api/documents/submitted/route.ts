import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { documentService } from "@/services/document.service";

export async function GET() {
  try {
    const actor = await requireUser();

    const documents = await documentService.findSubmittedDocuments(actor);

    return NextResponse.json(documents);
  } catch (error) {
    return handleApiError(error);
  }
}
