"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/frontend/constants/query-keys";
import { authService } from "@/frontend/services/auth.service";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.currentUser,
      });
      router.replace("/dashboard");
    },
  });
}
