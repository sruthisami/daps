import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { requireUser } from "@/lib/auth";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <AppHeader user={user} />

        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
