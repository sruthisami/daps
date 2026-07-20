import axios from "axios";
import { toast } from "sonner";

export function showApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.issues?.fieldErrors) {
      const firstIssue = Object.values(data.issues.fieldErrors)
        .flat()
        .find(Boolean);

      toast.error((firstIssue as string) ?? data.error ?? "Validation failed.");
      return;
    }

    toast.error(data?.error ?? "Something went wrong.");
    return;
  }

  toast.error("Something went wrong.");
}