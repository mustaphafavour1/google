"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { FileText, Mail, Menu, X } from "lucide-react";
import { moreSheetItems, isNavItemActive } from "./nav-config";
import { cn } from "@/lib/utils";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import type { SiteSettings } from "@/lib/types";

export function MoreSheet({ contact }: { contact: SiteSettings["contact"] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-ink-soft"
          aria-label="More"
        >
          <Menu size={19} strokeWidth={2} />
          <span className="text-[10.5px] font-medium">More</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="sheet-content fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-hairline bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-4px_24px_rgb(15_23_42_/_0.12)]">
          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-hairline" />
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="type-subheading">More</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-soft hover:bg-surface-muted"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <ul className="flex flex-col gap-1">
            {moreSheetItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] transition-colors",
                      active
                        ? "bg-primary-tint font-semibold text-primary-tint-text"
                        : "text-ink-strong hover:bg-surface-muted",
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-hairline pt-3">
            {contact.resumeUrl && (
              <ResumeGateButton className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border text-[13px] font-medium text-ink-strong">
                <FileText size={14} />
                Resume
              </ResumeGateButton>
            )}
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary-500 text-[13px] font-medium text-white"
            >
              <Mail size={14} />
              Email me
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
