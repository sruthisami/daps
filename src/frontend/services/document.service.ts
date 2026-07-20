import { api } from "@/frontend/lib/api";
import type { DocumentItem } from "@/frontend/types/document";
import { DocumentStatus } from "@/generated/prisma/client";
import type { AuditEvent, ActivityEvent } from "@/frontend/types/audit";

export const documentService = {
  async listMy(): Promise<DocumentItem[]> {
    const response = await api.get("/documents/mine");
    return response.data;
  },

  async listSubmitted(): Promise<DocumentItem[]> {
    const response = await api.get("/documents/submitted");
    return response.data;
  },

  async listPublished(): Promise<DocumentItem[]> {
    const response = await api.get("/documents/published");
    return response.data;
  },

  async listByStatus(status: DocumentStatus): Promise<DocumentItem[]> {
    const response = await api.get("/documents", {
      params: {
        status,
      },
    });

    return response.data;
  },

  async create(input: { title: string; body: string }): Promise<DocumentItem> {
    const response = await api.post("/documents", input);
    return response.data;
  },

  async update(
    id: string,
    input: { expectedVersion: number; title: string; body: string },
  ): Promise<DocumentItem> {
    const response = await api.patch(`/documents/${id}`, input);
    return response.data;
  },

  async submit(id: string, expectedVersion: number): Promise<DocumentItem> {
    const response = await api.post(`/documents/${id}/submit`, {
      expectedVersion,
    });
    return response.data;
  },

  async approve(id: string, expectedVersion: number): Promise<DocumentItem> {
    const response = await api.post(`/documents/${id}/approve`, {
      expectedVersion,
    });
    return response.data;
  },

  async reject(
    id: string,
    expectedVersion: number,
    comment: string,
  ): Promise<DocumentItem> {
    const response = await api.post(`/documents/${id}/reject`, {
      expectedVersion,
      comment,
    });
    return response.data;
  },

  async publish(id: string, expectedVersion: number): Promise<DocumentItem> {
    const response = await api.post(`/documents/${id}/publish`, {
      expectedVersion,
    });
    return response.data;
  },

  async reopen(id: string, expectedVersion: number): Promise<DocumentItem> {
    const response = await api.post(`/documents/${id}/reopen`, {
      expectedVersion,
    });
    return response.data;
  },

  async archive(id: string, expectedVersion: number): Promise<DocumentItem> {
    const response = await api.post(`/documents/${id}/archive`, {
      expectedVersion,
    });
    return response.data;
  },
async audit(id: string): Promise<AuditEvent[]> {
  const response = await api.get(`/documents/${id}/audit`);
  return response.data;
},

async activity(): Promise<ActivityEvent[]> {
    const response = await api.get("/documents/activity");
    return response.data;
  },
};

