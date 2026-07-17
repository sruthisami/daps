import { prisma } from "@/lib/db";
import { DatabaseClient } from "@/lib/transactionClient";
import { Prisma, AuditEvent } from "@/generated/prisma/client";

export function createAuditRepository(
  db: DatabaseClient = prisma
) {
  return {
    create(data: Prisma.AuditEventCreateInput): Promise<AuditEvent> {
      return db.auditEvent.create({
        data,
      });
    },

    findByDocument(documentId: string) {
      return db.auditEvent.findMany({
        where: {
          documentId,
        },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    },
  };
}

export const auditRepository = createAuditRepository();