/*
  Warnings:

  - You are about to drop the column `metadata` on the `AuditEvent` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuditEvent" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- Prevent modification of audit events

CREATE OR REPLACE FUNCTION prevent_audit_update()
RETURNS TRIGGER AS
$$
BEGIN
    RAISE EXCEPTION 'Audit events cannot be updated.';
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER audit_event_no_update
BEFORE UPDATE
ON "AuditEvent"
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_update();

