"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong",
        className,
      )}
    >
      <ArrowLeft size={15} />
    </button>
  );
}
