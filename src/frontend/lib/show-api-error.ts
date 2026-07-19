import axios from "axios";
import { toast } from "sonner";

export function showApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    toast.error(
      error.response?.data?.message ?? "Something went wrong.",
    );
    return;
  }

  toast.error("Something went wrong.");
}