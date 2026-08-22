import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { MobileHeader } from "./mobile-header";
import { BottomTabBar } from "./bottom-tab-bar";

export function AppShell({
  siteSettings,
  children,
}: {
  siteSettings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar profile={siteSettings.profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar resumeUrl={siteSettings.contact.resumeUrl} />
        <MobileHeader />
        <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      </div>
      <BottomTabBar contact={siteSettings.contact} />
    </div>
  );
}
