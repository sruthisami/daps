"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateDocument,
  useMyDocuments,
  useSubmitDocument,
  useUpdateDocument,
} from "@/frontend/hooks/use-documents";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useMyDocuments();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const submitDocument = useSubmitDocument();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const draftDocuments = useMemo(
    () => documents.filter((document) => document.status === "DRAFT"),
    [documents],
  );

  const submittedDocuments = useMemo(
    () => documents.filter((document) => document.status === "SUBMITTED"),
    [documents],
  );

  async function handleCreate() {
    if (!title.trim() || !body.trim()) {
      return;
    }

    await createDocument.mutateAsync({ title, body });
    setTitle("");
    setBody("");
  }

  async function handleSubmit(documentId: string, expectedVersion: number) {
    await submitDocument.mutateAsync({ id: documentId, expectedVersion });
  }

  async function handleUpdate(documentId: string, expectedVersion: number) {
    await updateDocument.mutateAsync({
      id: documentId,
      input: {
        expectedVersion,
        title,
        body,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Author workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            My documents
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Document title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            className="min-h-32 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="Write the document body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <Button
            onClick={handleCreate}
            className="gap-2"
            disabled={createDocument.isPending}
          >
            <PlusCircle className="h-4 w-4" />
            Create document
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading documents…
              </p>
            ) : draftDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No draft documents yet.
              </p>
            ) : (
              draftDocuments.map((document) => (
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
                      variant="outline"
                      onClick={() =>
                        handleUpdate(document.id, document.version)
                      }
                    >
                      Save changes
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleSubmit(document.id, document.version)
                      }
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submitted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submittedDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents are currently under review.
              </p>
            ) : (
              submittedDocuments.map((document) => (
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
    </div>
  );
}
