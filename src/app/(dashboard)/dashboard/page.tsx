"use client";

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
import { useCurrentUser } from "@/frontend/hooks/use-current-user";
import { useRecentActivity } from "@/frontend/hooks/use-documents";
import type { ActivityEvent } from "@/frontend/types/audit";

const ROLES = [
  {
    role: "Viewer",
    actions: ["Read published documents"],
  },
  {
    role: "Author",
    actions: [
      "Create documents",
      "Edit own drafts",
      "Submit for review",
      "Reopen rejected",
    ],
  },
  {
    role: "Reviewer",
    actions: ["Approve submitted", "Reject with comment", "Publish approved"],
  },
  {
    role: "Admin",
    actions: ["Publish approved", "Archive any document"],
  },
];

const PILLARS = [
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
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const ACTION_LABEL: Record<ActivityEvent["action"], string> = {
  CREATED: "created",
  EDITED: "edited",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  REOPENED: "reopened",
};

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PILLARS.map((item) => (
          <div key={item.label} className="rounded-md border p-4">
            <p className="mb-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              {item.label}
            </p>
            <p className="text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Roles and responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {ROLES.map(({ role, actions }) => (
            <div
              key={role}
              className="grid grid-cols-[120px_1fr] items-start gap-3 border-b py-2.5 last:border-0"
            >
              <span className="inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                {role}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {actions.map((action) => (
                  <span
                    key={action}
                    className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityTab() {
  const recentActivity = useRecentActivity();
  const activity = recentActivity.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivity.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading activity…</p>
        ) : activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity to show yet.
          </p>
        ) : (
          activity.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-3 border-b pb-2 text-sm last:border-0 last:pb-0"
            >
              <div>
                <span className="font-medium">{event.actor.name}</span>{" "}
                <span className="text-muted-foreground">
                  {ACTION_LABEL[event.action]}
                </span>{" "}
                <span className="font-medium">{event.document.title}</span>
                {event.comment && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground">
                    "{event.comment}"
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(event.createdAt)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardRoutePage() {
  const currentUser = useCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Workspace overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, {currentUser.data?.name ?? "there"}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A document moves through a controlled workflow before it becomes
          public. Every state change is recorded. Nothing is ever silently
          overwritten or deleted.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}