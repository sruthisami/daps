"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

export function SubmitButton({
  loading = false,
  loadingText = '',
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
  type="submit"
  disabled={loading || disabled}
  {...props}
>
  {loading && (
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  )}

  {loading ? loadingText ?? children : children}
</Button>
  );
}