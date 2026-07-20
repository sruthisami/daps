import { DocumentStatus } from "@/generated/prisma/client";

export const queryKeys = {
  currentUser: ["current-user"] as const,
  activity: ["activity"] as const,

  documents: {
    my: ["documents", "my"] as const,
    submitted: ["documents", "submitted"] as const,
    published: ["documents", "published"] as const,
    approved: ["documents", "approved"] as const,
    archived: ["documents", "archived"] as const,
    audit: (documentId: string) => ["documents", documentId, "audit"] as const,
    status: ["documents", "status"] as const,

    byStatus: (status: DocumentStatus) =>
      [...queryKeys.documents.status, status] as const,

    detail: (id: string) => ["documents", id] as const,
  },
};