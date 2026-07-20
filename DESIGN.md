# DESIGN.md

One line from the spec stayed with me throughout the build:
 
> Real systems are not defined by their happy path. They are defined by what they refuse to do.
 
I kept coming back to it every time I made a decision — what should this endpoint block, what should this check catch, what should the database make impossible. The sections below reflect that thinking.

## Implementation on 9 user stories in spec

For implementation details, see the [Implementation Document](./9-stories-in-spec.pdf).

## The most important invariants

- A document's state and its audit event change in the same transaction or not at all.
- Only a document's owner can edit or submit it.
- Visibility is determined by status : viewers have no path to anything unpublished.

---

## What the database enforces vs. application code

**Database:**

- A check constraint in the db migration enforces that rejected audit events must have a non-empty comment.
- `onDelete: Restrict` on `Document → owner` and `AuditEvent → actor` means users cannot be deleted while they own documents or have audit history. `AuditEvent → document` is also `Restrict` : audit history cannot be silently removed with the document.
- `onDelete: Cascade` on `Session → user` so sessions are cleaned up when a user is removed.
- Indexes on `[status, createdAt]` for the reviewer queue, `[ownerId]` for the author workspace, `[documentId, createdAt]` for audit history, and `[expiresAt]` for session cleanup : each reflects an actual read pattern.
- Logout is idempotent
- PostgreSQL triggers make the audit log immutable by rejecting any UPDATE or DELETE on AuditEvent, ensuring audit history is append-only even if someone bypasses the application and executes SQL directly.
- Deleted documents are never physically removed from the database. Soft deletes preserve document history and audit integrity.

**Application code:**

Everything that requires reasoning about roles and ownership together. The database does not know that a reviewer cannot approve their own document: that rule only makes sense at the service layer.

---

## How permissions work

Authentication happens in the route handler : resolve the user from the session cookie or reject the request. Authorisation happens in the service layer - check role first, then ownership against the specific document. These are two separate checks, always explicit, never inferred from the UI.

---

## Optimistic concurrency

Every mutation includes an `expectedVersion`. The repository uses `updateMany` with `id` and `version` in the `where` clause. If the version has moved on, no row matches, count is zero, and the service throws a `ConflictError` with a clear message. I used `updateMany` over `update` because Prisma's `update` only matches on unique fields - `version` cannot be added to the `where` clause without it.

---

## What I'd improve with more time

- The session implementation with seeded users is intentionally minimal. A real system would include refresh token rotation, inactivity timeouts, and rate limiting on login.
- Add pagination, filtering, and sorting for documents and audit history to keep queries efficient as data grows.
- Introduce cursor-based pagination for audit logs instead of offset pagination to improve scalability.
- Add structured metadata to audit events (for example, changed fields) to provide richer change history without parsing document versions.
- Add observability with structured logging, metrics, and distributed tracing to simplify debugging and production monitoring.
Replace the monolithic architecture with microservices and an event bus if the system needed to scale across independent services or support asynchronous workflows such as notifications and search indexing.