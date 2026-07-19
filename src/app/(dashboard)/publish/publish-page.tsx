"use client";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDocumentsByStatus,
  usePublishDocument,
} from "@/frontend/hooks/use-documents";
import { DocumentStatus } from "@/frontend/types/document-status";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function PublishPage() {
  const {
    data: documents = [],
    isLoading,
    error,
  } = useDocumentsByStatus(DocumentStatus.APPROVED);
  const publishDocument = usePublishDocument();

  async function handlePublish(documentId: string, expectedVersion: number) {
    await publishDocument.mutateAsync({ id: documentId, expectedVersion });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Publishing
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Publish approved documents
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approved documents ready to publish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading approved documents…
            </p>
          ) : error ? (
            <p className="text-sm text-destructive">
              Failed to load approved documents.
            </p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No approved documents are ready to publish.
            </p>
          ) : (
            documents.map((document) => (
              <div key={document.id} className="rounded border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{document.title}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {formatStatus(document.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {document.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePublish(document.id, document.version)}
                    disabled={publishDocument.isPending}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
