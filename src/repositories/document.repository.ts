import { prisma } from "@/lib/db";
import { DatabaseClient } from "@/lib/transactionClient";
import { Prisma, Document, DocumentStatus } from "@/generated/prisma/client";

export function createDocumentRepository(db: DatabaseClient = prisma) {
  return {
    create(data: Prisma.DocumentCreateInput): Promise<Document> {
      return db.document.create({
        data,
      });
    },

    findById(id: string): Promise<Document | null> {
      return db.document.findUnique({
        where: {
          id,
        },
      });
    },

    findByOwner(ownerId: string): Promise<Document[]> {
      return db.document.findMany({
        where: {
          ownerId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    },

    findSubmitted(): Promise<Document[]> {
      return db.document.findMany({
        where: {
          status: DocumentStatus.SUBMITTED,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    },

    findPublished(): Promise<Document[]> {
      return db.document.findMany({
        where: {
          status: DocumentStatus.PUBLISHED,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    },

    async update(
      id: string,
      expectedVersion: number,
      data: Prisma.DocumentUpdateInput,
    ): Promise<Document | null> {
      const result = await db.document.updateMany({
        where: {
          id,
          version: expectedVersion,
        },
        data: {
          ...data,
          version: {
            increment: 1,
          },
        },
      });

      if (result.count === 0) {
        return null;
      }

      return db.document.findUnique({
        where: {
          id,
        },
      });
    },
  };
}

export const documentRepository = createDocumentRepository();
