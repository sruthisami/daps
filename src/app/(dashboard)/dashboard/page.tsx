"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function DashboardRoutePage() {


  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Workspace overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          hey there!
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A document moves through a controlled workflow before it becomes
          public. Every state change is recorded. Nothing is ever silently
          overwritten or deleted.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PILLARS.map((item) => (
          <div
            key={item.label}
            className="rounded-md border p-4"
          >
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