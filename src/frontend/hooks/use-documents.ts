"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/frontend/constants/query-keys";
import { documentService } from "@/frontend/services/document.service";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/frontend/types/document";

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
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.published });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDocumentInput }) =>
      documentService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
    },
  });
}

export function useSubmitDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expectedVersion }: { id: string; expectedVersion: number }) =>
      documentService.submit(id, expectedVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.submitted });
    },
  });
}

export function useApproveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expectedVersion }: { id: string; expectedVersion: number }) =>
      documentService.approve(id, expectedVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.submitted });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.published });
    },
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
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.submitted });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
    },
  });
}

export function usePublishDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expectedVersion }: { id: string; expectedVersion: number }) =>
      documentService.publish(id, expectedVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.published });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
    },
  });
}

export function useReopenDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expectedVersion }: { id: string; expectedVersion: number }) =>
      documentService.reopen(id, expectedVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
    },
  });
}

export function useArchiveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expectedVersion }: { id: string; expectedVersion: number }) =>
      documentService.archive(id, expectedVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.published });
    },
  });
}
