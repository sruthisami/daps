"use client"
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useLogout } from "@/frontend/hooks/use-logout";
import { User } from "@/frontend/types/auth";

type AppHeaderProps = {
  user: User;
};

export function AppHeader({ user }: AppHeaderProps) {
  const logout = useLogout();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger />

        <div className="flex-1" />

        <span className="text-sm text-muted-foreground">{user.name}</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout.mutate()}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
