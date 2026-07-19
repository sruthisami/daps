import { prisma } from "@/lib/db";
import { ServiceDatabaseClient } from "@/lib/dbclient";

import {
  AuditAction,
  Document,
  DocumentStatus,
  Prisma,
  User,
  UserRole,
} from "@/generated/prisma/client";

import { createAuditRepository } from "@/repositories/audit.repository";

import { createDocumentRepository } from "@/repositories/document.repository";

import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/errors";

import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/validations/document.validation";

type DocumentRepository = ReturnType<typeof createDocumentRepository>;

type AuditRepository = ReturnType<typeof createAuditRepository>;

export function createDocumentService(db: ServiceDatabaseClient = prisma) {
  //authorization
  function assertAdmin(user: User): void {
    if (user.role !== UserRole.ADMIN) {
      throw new AuthorizationError(
        "You are not authorized to perform this action.",
      );
    }
  }

  function assertAuthor(user: User): void {
    if (user.role !== UserRole.AUTHOR) {
      throw new AuthorizationError(
        "You are not authorized to perform this action.",
      );
    }
  }

  function assertReviewer(user: User): void {
    if (user.role !== UserRole.REVIEWER) {
      throw new AuthorizationError(
        "You are not authorized to perform this action.",
      );
    }
  }

  function assertReviewerOrAdmin(user: User) {
    if (user.role !== UserRole.REVIEWER && user.role !== UserRole.ADMIN) {
      throw new AuthorizationError(
        "You are not authorized to perform this action.",
      );
    }
  }

  function assertOwner(user: User, document: Document): void {
    if (document.ownerId !== user.id) {
      throw new AuthorizationError(
        "You are not authorized to perform this action.",
      );
    }
  }

  //workflow
  function assertDraft(document: Document, action: string): void {
    if (document.status !== DocumentStatus.DRAFT) {
      throw new ConflictError(
        `Cannot ${action} a document in the ${document.status.toLowerCase()} state.`,
      );
    }
  }

  function assertSubmitted(document: Document, action: string): void {
    if (document.status !== DocumentStatus.SUBMITTED) {
      throw new ConflictError(
        `Cannot ${action} a document in the ${document.status.toLowerCase()} state.`,
      );
    }
  }

  function assertRejected(document: Document, action: string): void {
    if (document.status !== DocumentStatus.REJECTED) {
      throw new ConflictError(
        `Cannot ${action} a document in the ${document.status.toLowerCase()} state.`,
      );
    }
  }

  function assertApproved(document: Document, action: string): void {
    if (document.status !== DocumentStatus.APPROVED) {
      throw new ConflictError(
        `Cannot ${action} a document in the ${document.status.toLowerCase()} state.`,
      );
    }
  }

  function assertArchivable(document: Document): void {
    if (
      document.status !== DocumentStatus.DRAFT &&
      document.status !== DocumentStatus.SUBMITTED &&
      document.status !== DocumentStatus.APPROVED &&
      document.status !== DocumentStatus.PUBLISHED
    ) {
      throw new ConflictError(
        `Cannot archive a document in the ${document.status.toLowerCase()} state.`,
      );
    }
  }

  //audit
  async function createAudit(
    auditRepository: AuditRepository,
    action: AuditAction,
    actorId: string,
    documentId: string,
    previousStatus: DocumentStatus | null,
    newStatus: DocumentStatus | null,
    comment?: string,
  ): Promise<void> {
    await auditRepository.create({
      action,
      previousStatus,
      newStatus,
      comment,
      actor: {
        connect: {
          id: actorId,
        },
      },
      document: {
        connect: {
          id: documentId,
        },
      },
    });
  }

  //write ops
  async function create(
    input: CreateDocumentInput,
    actor: User,
  ): Promise<Document> {
    assertAuthor(actor);

    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.create({
        title: input.title,
        body: input.body,
        owner: {
          connect: {
            id: actor.id,
          },
        },
      });

      await createAudit(
        auditRepository,
        AuditAction.CREATED,
        actor.id,
        document.id,
        null,
        DocumentStatus.DRAFT,
      );

      return document;
    });
  }

  async function edit(
    id: string,
    expectedVersion: number,
    input: UpdateDocumentInput,
    actor: User,
  ): Promise<Document> {
    assertAuthor(actor);

    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      assertOwner(actor, document);
      assertDraft(document, "edit");

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          title: input.title,
          body: input.body,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.EDITED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
      );

      return updatedDocument;
    });
  }

  async function submit(
    id: string,
    expectedVersion: number,
    actor: User,
  ): Promise<Document> {
    assertAuthor(actor);

    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      assertOwner(actor, document);
      assertDraft(document, "submit");

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          status: DocumentStatus.SUBMITTED,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.SUBMITTED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
      );

      return updatedDocument;
    });
  }

  async function approve(
    id: string,
    expectedVersion: number,
    actor: User,
  ): Promise<Document> {
    assertReviewer(actor);
    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      if (document.ownerId === actor.id) {
        throw new AuthorizationError("You cannot approve your own document.");
      }

      assertSubmitted(document, "approve");

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          status: DocumentStatus.APPROVED,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.APPROVED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
      );

      return updatedDocument;
    });
  }

  async function reject(
    id: string,
    expectedVersion: number,
    comment: string,
    actor: User,
  ): Promise<Document> {
    assertReviewer(actor);

    if (!comment.trim()) {
      throw new ValidationError(
        "A comment is required when rejecting a document.",
      );
    }

    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      assertSubmitted(document, "reject");

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          status: DocumentStatus.REJECTED,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.REJECTED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
        comment,
      );

      return updatedDocument;
    });
  }

  async function reopen(
    id: string,
    expectedVersion: number,
    actor: User,
  ): Promise<Document> {
    assertAuthor(actor);

    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      assertOwner(actor, document);
      assertRejected(document, "reopen");

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          status: DocumentStatus.DRAFT,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.REOPENED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
      );

      return updatedDocument;
    });
  }

  async function publish(
    id: string,
    expectedVersion: number,
    actor: User,
  ): Promise<Document> {
    assertReviewerOrAdmin(actor);
    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      assertApproved(document, "publish");

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          status: DocumentStatus.PUBLISHED,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.PUBLISHED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
      );

      return updatedDocument;
    });
  }

  async function archive(
    id: string,
    expectedVersion: number,
    actor: User,
  ): Promise<Document> {
    assertAdmin(actor);

    return await db.$transaction(async (tx) => {
      const documentRepository = createDocumentRepository(tx);
      const auditRepository = createAuditRepository(tx);

      const document = await documentRepository.findById(id);

      if (!document) {
        throw new NotFoundError("Document not found.");
      }

      assertArchivable(document);

      const updatedDocument = await documentRepository.update(
        id,
        expectedVersion,
        {
          status: DocumentStatus.ARCHIVED,
        },
      );

      if (!updatedDocument) {
        throw new ConflictError(
          "The document has changed since you last viewed it. Please refresh and try again.",
        );
      }

      await createAudit(
        auditRepository,
        AuditAction.ARCHIVED,
        actor.id,
        document.id,
        document.status,
        updatedDocument.status,
      );

      return updatedDocument;
    });
  }

  //authorization helper for read ops

  function assertCanView(document: Document, user: User): void {
    if (document.ownerId === user.id) {
      return;
    }

    if (document.status === DocumentStatus.PUBLISHED) {
      return;
    }

    if (
      (user.role === UserRole.REVIEWER || user.role === UserRole.ADMIN) &&
      (document.status === DocumentStatus.SUBMITTED ||
        document.status === DocumentStatus.APPROVED ||
        document.status === DocumentStatus.ARCHIVED)
    ) {
      return;
    }

    throw new AuthorizationError(
      "You are not authorized to view this document.",
    );
  }

  //read ops
  async function findById(id: string, actor: User): Promise<Document> {
    const documentRepository = createDocumentRepository(db);

    const document = await documentRepository.findById(id);

    if (!document) {
      throw new NotFoundError("Document not found.");
    }

    assertCanView(document, actor);

    return document;
  }

  async function findMyDocuments(actor: User): Promise<Document[]> {
    assertAuthor(actor);

    const documentRepository = createDocumentRepository(db);

    return documentRepository.findByOwner(actor.id);
  }

  async function findSubmittedDocuments(actor: User): Promise<Document[]> {
    assertReviewerOrAdmin(actor);

    const documentRepository = createDocumentRepository(db);

    return documentRepository.findSubmitted();
  }

  async function findPublishedDocuments(): Promise<Document[]> {
    const documentRepository = createDocumentRepository(db);

    return documentRepository.findPublished();
  }

  async function findDocumentAudit(
  documentId: string,
  actor: User,
) {
  const documentRepository = createDocumentRepository(db);
  const auditRepository = createAuditRepository(db);

  const document = await documentRepository.findById(documentId);

  if (!document) {
    throw new NotFoundError("Document not found.");
  }

  assertCanView(document, actor);

  return auditRepository.findByDocument(documentId);
  }
  
async function findDocumentsByStatus(
  status: DocumentStatus,
  actor: User,
): Promise<Document[]> {
  switch (status) {
    case DocumentStatus.SUBMITTED:
    case DocumentStatus.APPROVED:
      assertReviewerOrAdmin(actor);
      break;

    case DocumentStatus.DRAFT:
    case DocumentStatus.PUBLISHED:
    case DocumentStatus.ARCHIVED:
      assertAdmin(actor);
      break;

    default:
      throw new ValidationError("Unsupported document status.");
  }

  const documentRepository = createDocumentRepository(db);

  return documentRepository.findByStatus(status);
}
  return {
    create,
    edit,
    submit,
    approve,
    reject,
    reopen,
    publish,
    archive,
    findById,
    findMyDocuments,
    findDocumentsByStatus,
    findSubmittedDocuments,
    findPublishedDocuments,
    findDocumentAudit,
  };
}

export const documentService = createDocumentService();
