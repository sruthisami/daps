import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { documentService } from "@/services/document.service";

export async function GET() {
  try {
    const documents = await documentService.findPublishedDocuments();

    return NextResponse.json(documents);
  } catch (error) {
    return handleApiError(error);
  }
}
