import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { documentService } from "@/services/document.service";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const actor = await requireUser();

    const { id } = await params;

    const auditEvents = await documentService.findDocumentAudit(id, actor);

    return NextResponse.json(auditEvents);
  } catch (error) {
    return handleApiError(error);
  }
}