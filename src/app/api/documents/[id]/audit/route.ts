import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { auditRepository } from "@/repositories/audit.repository";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireUser();

    const { id } = await params;

    const auditEvents = await auditRepository.findByDocument(id);

    return NextResponse.json(auditEvents);
  } catch (error) {
    return handleApiError(error);
  }
}
