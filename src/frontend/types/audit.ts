export type AuditEvent = {
  id: string;
  action:
    | "CREATED"
    | "EDITED"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "ARCHIVED"
    | "REOPENED";

  previousStatus:
    | "DRAFT"
    | "SUBMITTED"
    | "REJECTED"
    | "APPROVED"
    | "PUBLISHED"
    | "ARCHIVED"
    | null;

  newStatus:
    | "DRAFT"
    | "SUBMITTED"
    | "REJECTED"
    | "APPROVED"
    | "PUBLISHED"
    | "ARCHIVED"
    | null;

  comment: string | null;

  createdAt: string;

  actor: {
    id: string;
    name: string;
    role: "VIEWER" | "AUTHOR" | "REVIEWER" | "ADMIN";
  };
};

export type ActivityEvent = AuditEvent & {
  document: {
    id: string;
    title: string;
    status:
      | "DRAFT"
      | "SUBMITTED"
      | "REJECTED"
      | "APPROVED"
      | "PUBLISHED"
      | "ARCHIVED";
  };
};

