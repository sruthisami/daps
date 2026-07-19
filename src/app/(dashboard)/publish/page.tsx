import { UserRole } from "@/generated/prisma/enums";
import { requireRoles } from "@/lib/auth";

import PublishPage from "./publish-page";

export default async function Page() {
  await requireRoles([UserRole.REVIEWER, UserRole.ADMIN]);

  return <PublishPage />;
}