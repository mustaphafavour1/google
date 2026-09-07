import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Briefcase,
  Home,
  Images,
  Lightbulb,
  Newspaper,
  Rocket,
  User,
  Workflow,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Process + Skills", href: "/process", icon: Workflow },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "DDD", href: "/ddd", icon: Lightbulb },
  { label: "Profile", href: "/profile", icon: User },
  { label: "For Fun", href: "/playground", icon: Rocket },
  { label: "Archive", href: "/archive", icon: Archive },
];

export const mobileTabs: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Process + Skills", href: "/process", icon: Workflow },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Profile", href: "/profile", icon: User },
];

export const moreSheetItems: NavItem[] = [
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "DDD", href: "/ddd", icon: Lightbulb },
  { label: "For Fun", href: "/playground", icon: Rocket },
  { label: "Archive", href: "/archive", icon: Archive },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
