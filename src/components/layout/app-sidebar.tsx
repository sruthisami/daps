import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { User } from "@/frontend/types/auth";

import { AppLogo } from "./app-logo";
import { NavMain } from "./nav-main";

type AppSidebarProps = {
  user: User;
};

export function AppSidebar({
  user,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>

      <SidebarContent>
        <NavMain user={user} />
      </SidebarContent>

    </Sidebar>
  );
}