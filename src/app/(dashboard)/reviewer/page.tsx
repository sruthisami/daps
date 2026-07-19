"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useApproveDocument,
  useRejectDocument,
  useSubmittedDocuments,
} from "@/frontend/hooks/use-documents";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function ReviewerPage() {
  const { data: documents = [], isLoading } = useSubmittedDocuments();
  const approveDocument = useApproveDocument();
  const rejectDocument = useRejectDocument();

  async function handleApprove(documentId: string, expectedVersion: number) {
    await approveDocument.mutateAsync({ id: documentId, expectedVersion });
  }

  async function handleReject(documentId: string, expectedVersion: number) {
    await rejectDocument.mutateAsync({
      id: documentId,
      expectedVersion,
      comment: "Please revise this document before resubmission.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Review queue</p>
        <h1 className="text-3xl font-semibold tracking-tight">Pending review</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents waiting for review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading review queue…</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents are currently pending review.</p>
          ) : (
            documents.map((document) => (
              <div key={document.id} className="rounded border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{document.title}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {formatStatus(document.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{document.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleReject(document.id, document.version)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(document.id, document.version)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
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
