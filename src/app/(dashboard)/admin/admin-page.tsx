"use client";

import { Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  useArchiveDocument,
  useDocumentsByStatus,
} from "@/frontend/hooks/use-documents";

import { DocumentStatus } from "@/frontend/types/document-status";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function StatusPanel({
  status,
}: {
  status: DocumentStatus;
}) {
  const { data: documents = [], isLoading } =
    useDocumentsByStatus(status);

  const archiveDocument = useArchiveDocument();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading documents...
      </p>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No {formatStatus(status)} documents.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="rounded-lg border p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {document.title}
              </h3>

              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {formatStatus(document.status)}
              </p>
            </div>

            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
              disabled={archiveDocument.isPending}
              onClick={() =>
                archiveDocument.mutate({
                  id: document.id,
                  expectedVersion: document.version,
                })
              }
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </div>

          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {document.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Administration
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Document Management
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={DocumentStatus.DRAFT}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value={DocumentStatus.DRAFT}>
                Draft
              </TabsTrigger>

              <TabsTrigger value={DocumentStatus.SUBMITTED}>
                Submitted
              </TabsTrigger>

              <TabsTrigger value={DocumentStatus.APPROVED}>
                Approved
              </TabsTrigger>

              <TabsTrigger value={DocumentStatus.PUBLISHED}>
                Published
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value={DocumentStatus.DRAFT}
              className="mt-6"
            >
              <StatusPanel status={DocumentStatus.DRAFT} />
            </TabsContent>

            <TabsContent
              value={DocumentStatus.SUBMITTED}
              className="mt-6"
            >
              <StatusPanel status={DocumentStatus.SUBMITTED} />
            </TabsContent>

            <TabsContent
              value={DocumentStatus.APPROVED}
              className="mt-6"
            >
              <StatusPanel status={DocumentStatus.APPROVED} />
            </TabsContent>

            <TabsContent
              value={DocumentStatus.PUBLISHED}
              className="mt-6"
            >
              <StatusPanel status={DocumentStatus.PUBLISHED} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}