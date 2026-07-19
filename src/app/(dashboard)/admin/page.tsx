import { requireAdmin } from "@/lib/auth";

import AdminPage  from "./admin-page";

export default async function Page() {
  await requireAdmin();

  return <AdminPage />;
}

