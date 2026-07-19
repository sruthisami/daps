"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { User } from "@/frontend/types/auth";
import { navLinks } from "./nav-links";

type NavMainProps = {
  user: User;
};

export function NavMain({ user }: NavMainProps) {
  const pathname = usePathname();

  const links = navLinks.filter((link) =>
    link.roles.includes(user.role)
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;

            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  render={<Link href={link.href} />}
                  isActive={active}
                  tooltip={link.title}
                >
                  <Icon />
                  <span>{link.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}