import { prisma } from "@/lib/db";
import { RepositoryDatabaseClient } from "@/lib/dbclient";
import { Prisma, AuditEvent } from "@/generated/prisma/client";

export function createAuditRepository(db: RepositoryDatabaseClient = prisma) {
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
    findRecent(limit: number) {
      return db.auditEvent.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          document: {
            select: {
              id: true,
              title: true,
              status: true,
              ownerId: true,
            },
          },
        },
      });
    },
  };
}

export const auditRepository = createAuditRepository();
