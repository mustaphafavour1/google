import type { LucideIcon } from "lucide-react";
import { BarChart3, Briefcase, Home, Layers, Mail, User, Workflow } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Work", href: "/work", icon: Briefcase },
  { label: "Process", href: "/process", icon: Workflow },
  { label: "About", href: "/about", icon: User },
  { label: "Skills", href: "/skills", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Contact", href: "/contact", icon: Mail },
];

export const mobileTabs: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Work", href: "/work", icon: Briefcase },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: Mail },
];

export const moreSheetItems: NavItem[] = [
  { label: "Process", href: "/process", icon: Workflow },
  { label: "Skills", href: "/skills", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
