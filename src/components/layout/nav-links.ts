import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  Home,
  ShieldCheck,
  Users,
  Archive,
  Send,
} from "lucide-react";

import { UserRole } from "@/generated/prisma/enums";

export type NavLink = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
};

export const navLinks: NavLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: [
      UserRole.AUTHOR,
      UserRole.REVIEWER,
      UserRole.ADMIN,
      UserRole.VIEWER,
    ],
  },
  {
    title: "My Documents",
    href: "/documents",
    icon: FileText,
    roles: [UserRole.AUTHOR],
  },
  {
    title: "Review Queue",
    href: "/reviewer",
    icon: ShieldCheck,
    roles: [UserRole.REVIEWER],
  },
  {
    title: "Publish",
    href: "/publish",
    icon: Send,
    roles: [UserRole.REVIEWER, UserRole.ADMIN],
  },
  {
    title: "Archived Documents",
    href: "/archive",
    icon: Archive,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Archive",
    href: "/admin",
    icon: Archive,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Published Documents",
    href: "/published",
    icon: BookOpen,
    roles: [
      UserRole.AUTHOR,
      UserRole.REVIEWER,
      UserRole.ADMIN,
      UserRole.VIEWER,
    ],
  },
];
