import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { AccessibilityMenu } from "./accessibility-menu";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-h) shrink-0 items-center justify-between border-b border-hairline bg-surface/95 px-4 backdrop-blur lg:hidden">
      <Logo compact />
      <div className="flex items-center gap-2">
        <AccessibilityMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
