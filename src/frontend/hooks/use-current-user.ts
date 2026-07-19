"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/frontend/constants/query-keys";
import { authService } from "@/frontend/services/auth.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: authService.me,
    retry: false,
  });
}