"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PlusCircle,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  useCreateDocument,
  useDocumentAudit,
  useMyDocuments,
  useReopenDocument,
  useSubmitDocument,
  useUpdateDocument,
} from "@/frontend/hooks/use-documents";

import type { AuditEvent } from "@/frontend/types/audit";
import type { DocumentItem } from "@/frontend/types/document";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const ACTION_LABEL: Record<AuditEvent["action"], string> = {
  CREATED: "Created",
  EDITED: "Edited",
  SUBMITTED: "Submitted for review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
  REOPENED: "Reopened",
};

const ACTION_STYLE: Record<AuditEvent["action"], string> = {
  CREATED: "bg-foreground",
  EDITED: "bg-muted-foreground",
  SUBMITTED: "bg-foreground",
  APPROVED: "bg-foreground",
  REJECTED: "bg-foreground",
  PUBLISHED: "bg-foreground",
  ARCHIVED: "bg-muted-foreground",
  REOPENED: "bg-foreground",
};

function AuditHistory({ documentId }: { documentId: string }) {
  const { data: events = [], isLoading } = useDocumentAudit(documentId);

  if (isLoading) {
    return (
      <p className="pt-3 text-xs text-muted-foreground">
        Loading history…
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p className="pt-3 text-xs text-muted-foreground">
        No history yet.
      </p>
    );
  }

  return (
    <ol className="relative mt-3 space-y-3 border-l border-border pl-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="relative"
        >
          <span
  className={`absolute -left-[1.3125rem] mt-1 h-2.5 w-2.5 rounded-full ring-2 ring-background ${ACTION_STYLE[event.action]}`}
/>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs font-medium">
                {ACTION_LABEL[event.action]}
              </span>

              <span className="text-xs text-muted-foreground">
                by {event.actor.name}
                <span className="ml-1 opacity-60">
                  ({event.actor.role.toLowerCase()})
                </span>
              </span>
            </div>

            {event.comment && (
              <p className="text-xs italic text-muted-foreground">
                "{event.comment}"
              </p>
            )}

            <p className="text-xs text-muted-foreground/60">
              {formatDate(event.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function AuditToggle({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}

        {open ? "Hide history" : "View history"}
      </button>

      {open && <AuditHistory documentId={documentId} />}
    </div>
  );
}

export default function DocumentsView() {
  const { data: documents = [], isLoading } = useMyDocuments();

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const submitDocument = useSubmitDocument();
  const reopenDocument = useReopenDocument();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const draftDocuments = useMemo(
    () => documents.filter((d) => d.status === "DRAFT"),
    [documents],
  );

  const submittedDocuments = useMemo(
    () => documents.filter((d) => d.status === "SUBMITTED"),
    [documents],
  );

  const rejectedDocuments = useMemo(
    () => documents.filter((d) => d.status === "REJECTED"),
    [documents],
  );

  const publishedDocuments = useMemo(
    () => documents.filter((d) => d.status === "PUBLISHED"),
    [documents],
  );

  async function handleCreate() {
    if (!title.trim() || !body.trim()) return;

    await createDocument.mutateAsync({
      title,
      body,
    });

    setTitle("");
    setBody("");
  }

  function startEditing(document: DocumentItem) {
    setEditingId(document.id);
    setEditTitle(document.title);
    setEditBody(document.body);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  }

  async function handleSave(document: DocumentItem) {
    if (!editTitle.trim() || !editBody.trim()) return;

    await updateDocument.mutateAsync({
      id: document.id,
      input: {
        expectedVersion: document.version,
        title: editTitle,
        body: editBody,
      },
    });

    cancelEditing();
  }

  async function handleSubmit(
    documentId: string,
    expectedVersion: number,
  ) {
    await submitDocument.mutateAsync({
      id: documentId,
      expectedVersion,
    });
  }

  async function handleReopen(
    documentId: string,
    expectedVersion: number,
  ) {
    await reopenDocument.mutateAsync({
      id: documentId,
      expectedVersion,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Author workspace
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          My Documents
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a Document</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            placeholder="Write your document..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <Button
            onClick={handleCreate}
            disabled={createDocument.isPending}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {createDocument.isPending
              ? "Creating..."
              : "Create Document"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading documents...
              </p>
            ) : draftDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No draft documents.
              </p>
            ) : (
              draftDocuments.map((document) => {
                const isEditing = editingId === document.id;

                const isEdited =
                  editTitle.trim() !== document.title.trim() ||
                  editBody.trim() !== document.body.trim();

                return (
                  <div
                    key={document.id}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    {isEditing ? (
                      <>
                        <Input
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                        />

                        <textarea
                          className="min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                          value={editBody}
                          onChange={(e) =>
                            setEditBody(e.target.value)
                          }
                        />

                        <div className="flex gap-2">
                          {isEdited && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleSave(document)
                              }
                              disabled={updateDocument.isPending}
                            >
                              {updateDocument.isPending
                                ? "Saving..."
                                : "Save Changes"}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {document.title}
                          </h3>

                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {formatStatus(document.status)}
                          </span>
                        </div>

                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {document.body}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>
                            Version {document.version}
                          </span>

                          <span>
                            Updated{" "}
                            {formatDate(document.updatedAt)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              startEditing(document)
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            onClick={() =>
                              handleSubmit(
                                document.id,
                                document.version,
                              )
                            }
                            disabled={submitDocument.isPending}
                          >
                            Submit
                          </Button>
                        </div>

                        <AuditToggle
                          documentId={document.id}
                        />
                      </>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submitted</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading documents...
              </p>
            ) : submittedDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents are currently under review.
              </p>
            ) : (
              submittedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {document.title}
                    </h3>

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
                      Updated {formatDate(document.updatedAt)}
                    </span>
                  </div>

                  <AuditToggle documentId={document.id} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {(isLoading || rejectedDocuments.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Rejected</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading documents...
              </p>
            ) : (
              rejectedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {document.title}
                    </h3>

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
                      Updated {formatDate(document.updatedAt)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      handleReopen(document.id, document.version)
                    }
                    disabled={reopenDocument.isPending}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {reopenDocument.isPending
                      ? "Reopening..."
                      : "Reopen"}
                  </Button>

                  <AuditToggle documentId={document.id} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Published</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading documents...
            </p>
          ) : publishedDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No published documents.
            </p>
          ) : (
            publishedDocuments.map((document) => (
              <div
                key={document.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {document.title}
                  </h3>

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
                    Published {formatDate(document.updatedAt)}
                  </span>
                </div>

                <AuditToggle documentId={document.id} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}