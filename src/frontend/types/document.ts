import type { DocumentStatus } from "@/generated/prisma/enums";

export type DocumentItem = {
  id: string;
  title: string;
  body: string;
  status: DocumentStatus;
  version: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDocumentInput = {
  title: string;
  body: string;
};

export type UpdateDocumentInput = {
  expectedVersion: number;
  title: string;
  body: string;
};
