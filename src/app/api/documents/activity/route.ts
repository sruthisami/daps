import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { documentService } from "@/services/document.service";

export async function GET() {
  try {
    const actor = await requireUser();

    const events = await documentService.findRecentActivity(actor);

    return NextResponse.json(events);
  } catch (error) {
    return handleApiError(error);
  }
}