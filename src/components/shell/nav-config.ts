import type { LucideIcon } from "lucide-react";
import { Archive, Briefcase, Images, Info, LayoutDashboard, Package, Rocket, User, Workflow } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "My Products", href: "/products", icon: Package },
  { label: "About", href: "/about", icon: Info },
  { label: "Process", href: "/process", icon: Workflow },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Playground", href: "/playground", icon: Rocket },
  { label: "Archive", href: "/archive", icon: Archive },
];

export const mobileTabs: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Profile", href: "/profile", icon: User },
];

export const moreSheetItems: NavItem[] = [
  { label: "My Products", href: "/products", icon: Package },
  { label: "About", href: "/about", icon: Info },
  { label: "Process", href: "/process", icon: Workflow },
  { label: "Playground", href: "/playground", icon: Rocket },
  { label: "Archive", href: "/archive", icon: Archive },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
