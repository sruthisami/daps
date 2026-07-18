import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1),
});

export const editDocumentSchema = z.object({
  expectedVersion: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1),
});

export const actionDocumentSchema = z.object({
  expectedVersion: z.number().int().positive(),
});

export const rejectDocumentSchema = actionDocumentSchema.extend({
  comment: z.string().trim().min(1),
});

export const updateDocumentSchema = createDocumentSchema;

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type EditDocumentInput = z.infer<typeof editDocumentSchema>;