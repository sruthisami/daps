import { prisma } from "@/lib/db";
import {
  Prisma,
  Document,
  DocumentStatus,
} from "@/generated/prisma/client";

export const documentRepository = {
  create(data: Prisma.DocumentCreateInput): Promise<Document> {
    return prisma.document.create({
      data,
    });
  },

  findById(id: string): Promise<Document | null> {
    return prisma.document.findUnique({
      where: {
        id,
      },
    });
  },

  findByOwner(ownerId: string): Promise<Document[]> {
    return prisma.document.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  findSubmitted(): Promise<Document[]> {
    return prisma.document.findMany({
      where: {
        status: DocumentStatus.SUBMITTED,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findPublished(): Promise<Document[]> {
    return prisma.document.findMany({
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
    data: Prisma.DocumentUpdateInput
  ): Promise<boolean> {
    const result = await prisma.document.updateMany({
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

    return result.count === 1;
  },
};