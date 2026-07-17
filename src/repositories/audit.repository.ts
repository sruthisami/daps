import { prisma } from "@/lib/db";
import { Prisma, AuditEvent } from "@/generated/prisma/client";

export const auditRepository = {
  create(data: Prisma.AuditEventCreateInput): Promise<AuditEvent> {
    return prisma.auditEvent.create({
      data,
    });
  },

  findByDocument(documentId: string) {
    return prisma.auditEvent.findMany({
      where: {
        documentId,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
};