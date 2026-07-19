import { requireReviewer } from "@/lib/auth";

import PublishPage from "./publish-page";

export default async function Page() {
  await requireReviewer();

  return <PublishPage />;
}
