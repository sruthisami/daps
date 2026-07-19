import { requireAdmin } from "@/lib/auth";

import  ArchivePage from "./archive-page";

export default async function Page() {
  await requireAdmin();

  return <ArchivePage />;
}