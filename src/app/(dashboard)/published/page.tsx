"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublishedDocuments } from "@/frontend/hooks/use-documents";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function PublishedPage() {
  const { data: documents = [], isLoading } = usePublishedDocuments();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Published library
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Published documents
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All publicly available documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading published documents…
            </p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No published documents are available yet.
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
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
