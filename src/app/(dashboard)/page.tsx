"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/frontend/hooks/use-current-user";
import {
  useMyDocuments,
  usePublishedDocuments,
  useSubmittedDocuments,
} from "@/frontend/hooks/use-documents";
import { UserRole } from "@/generated/prisma/enums";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function AppOverview() {
  return (
    <div className="space-y-6 mb-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Workspace overview
        </p>
        <h1 className="text-2xl font-medium tracking-tight">
          Controlled Document Approval
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
          A document moves through a controlled workflow before it becomes
          public. Every state change is recorded. Nothing is ever silently
          overwritten or deleted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            label: "Workflow",
            description: "Draft → Submitted → Approved → Published",
          },
          {
            label: "Audit",
            description:
              "Every action is logged with actor, timestamp, and previous state.",
          },
          {
            label: "Archival",
            description:
              "Documents are archived, never deleted. History is always preserved.",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-md bg-muted/50 p-4">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
              {item.label}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Roles and responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              role: "Viewer",
              color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              actions: ["Read published documents"],
            },
            {
              role: "Author",
              color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              actions: [
                "Create documents",
                "Edit own drafts",
                "Submit for review",
                "Reopen rejected",
              ],
            },
            {
              role: "Reviewer",
              color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
              actions: [
                "Approve submitted",
                "Reject with comment",
                "Publish approved",
              ],
            },
            {
              role: "Admin",
              color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
              actions: ["Publish approved", "Archive any document"],
            },
          ].map(({ role, color, actions }) => (
            <div
              key={role}
              className="grid grid-cols-[120px_1fr] gap-3 items-start py-2 border-b last:border-0"
            >
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit ${color}`}
              >
                {role}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {actions.map((action) => (
                  <span
                    key={action}
                    className="text-xs px-2.5 py-0.5 rounded-full border bg-background text-muted-foreground"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Permissions are enforced server-side. Hiding a button is not enough —
        every action is verified against the current user's role and the
        document's current state.
      </p>
    </div>
  )
}
export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const myDocuments = useMyDocuments();
  const publishedDocuments = usePublishedDocuments();
  const canReview =
    currentUser.data?.role === UserRole.REVIEWER ||
    currentUser.data?.role === UserRole.ADMIN;
  const submittedDocuments = useSubmittedDocuments({ enabled: canReview });

  const documents = myDocuments.data ?? [];
  const published = publishedDocuments.data ?? [];
  const submitted = submittedDocuments.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Workspace overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, {currentUser.data?.name ?? "there"}
          </h1>
        </div>

        <Button onClick={() => router.push("/documents")}>
          Create document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My documents</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{documents.length}</div>
            <p className="text-sm text-muted-foreground">
              Drafts and submitted work
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{published.length}</div>
            <p className="text-sm text-muted-foreground">
              Visible documents in the library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review queue</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {canReview ? submitted.length : 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Pending review items
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents yet. Create your first one to get started.
              </p>
            ) : (
              documents.slice(0, 4).map((document) => (
                <div key={document.id} className="rounded border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{document.title}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {formatStatus(document.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {document.body}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {published.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Published documents will appear here once reviewers publish
                them.
              </p>
            ) : (
              published.slice(0, 4).map((document) => (
                <div key={document.id} className="rounded border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{document.title}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {formatStatus(document.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {document.body}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/documents"
            className="text-sm underline underline-offset-4"
          >
            Open my documents
          </Link>
          <Link
            href="/reviewer"
            className="text-sm underline underline-offset-4"
          >
            Review incoming documents
          </Link>
          <Link
            href="/published"
            className="text-sm underline underline-offset-4"
          >
            Browse the published library
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
