import { requireAuthor } from "@/lib/auth";
import DocumentsView  from "./documents-view";

export default async function Page() {
  await requireAuthor();

  return <DocumentsView />;
}