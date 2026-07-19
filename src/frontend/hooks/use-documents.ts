"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { showApiError } from "@/frontend/lib/show-api-error";
import { queryKeys } from "@/frontend/constants/query-keys";
import { documentService } from "@/frontend/services/document.service";
import type { AuditEvent } from "@/frontend/types/audit";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/frontend/types/document";
import { DocumentStatus } from "@/generated/prisma/client";

type QueryOptions = {
  enabled?: boolean;
};

export function useMyDocuments(options: QueryOptions = {}) {
  return useQuery({
    queryKey: queryKeys.documents.my,
    queryFn: documentService.listMy,
    enabled: options.enabled,
  });
}

export function useSubmittedDocuments(options: QueryOptions = {}) {
  return useQuery({
    queryKey: queryKeys.documents.submitted,
    queryFn: documentService.listSubmitted,
    enabled: options.enabled,
  });
}

export function usePublishedDocuments(options: QueryOptions = {}) {
  return useQuery({
    queryKey: queryKeys.documents.published,
    queryFn: documentService.listPublished,
    enabled: options.enabled,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => documentService.create(input),

    onSuccess: () => {
      toast.success("Document created.");

      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.published,
      });
    },

    onError: showApiError,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDocumentInput }) =>
      documentService.update(id, input),
    onSuccess: () => {
  toast.success("Document updated.");

  queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
},
onError: showApiError,
  });
}

export function useSubmitDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => documentService.submit(id, expectedVersion),
   onSuccess: () => {
  toast.success("Document submitted.");

  queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.submitted,
  });
},
onError: showApiError,
  });
}

export function useApproveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => documentService.approve(id, expectedVersion),
   onSuccess: () => {
  toast.success("Document approved.");

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.submitted,
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.published,
  });
},
onError: showApiError,
  });
}

export function useRejectDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      expectedVersion,
      comment,
    }: {
      id: string;
      expectedVersion: number;
      comment: string;
    }) => documentService.reject(id, expectedVersion, comment),
   onSuccess: () => {
  toast.success("Document rejected.");

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.submitted,
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.my,
  });
},
onError: showApiError,
  });
}

export function usePublishDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => documentService.publish(id, expectedVersion),
   onSuccess: () => {
  toast.success("Document published.");

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.published,
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.my,
  });
},
onError: showApiError,
  });
}

export function useReopenDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => documentService.reopen(id, expectedVersion),
   onSuccess: () => {
  toast.success("Document reopened.");

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.my,
  });
},
onError: showApiError,
  });
}

export function useArchiveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => documentService.archive(id, expectedVersion),

   onSuccess: () => {
  toast.success("Document archived.");

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.status,
  });

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.my,
  });

  queryClient.invalidateQueries({
    queryKey: queryKeys.documents.published,
  });
},
onError: showApiError,
  });
}

export function useDocumentsByStatus(
  status: DocumentStatus,
  options: QueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.documents.byStatus(status),
    queryFn: () => documentService.listByStatus(status),
    enabled: options.enabled,
  });
}

export function useDocumentAudit(documentId: string) {
  return useQuery<AuditEvent[]>({
    queryKey: queryKeys.documents.audit(documentId),
    queryFn: () => documentService.audit(documentId),
    enabled: !!documentId,
  });
}