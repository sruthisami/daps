"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDocumentsByStatus } from "@/frontend/hooks/use-documents";
import { DocumentStatus } from "@/frontend/types/document-status";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function ArchivePage() {
  const {
    data: documents = [],
    isLoading,
    error,
  } = useDocumentsByStatus(DocumentStatus.ARCHIVED);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Administration
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Archived Documents
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archive</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading archived documents...
            </p>
          ) : error ? (
            <p className="text-sm text-destructive">
              Failed to load archived documents.
            </p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No archived documents.
            </p>
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{document.title}</h3>

                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {formatStatus(document.status)}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {document.body}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Version {document.version}</span>
                  <span>
                    Updated{" "}
                    {new Date(document.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}