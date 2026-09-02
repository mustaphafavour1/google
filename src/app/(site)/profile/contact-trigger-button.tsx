"use client";

import { MessageSquare } from "lucide-react";
import { useContactForm } from "@/components/contact/contact-form-context";

export function ContactTriggerButton() {
  const { openForm } = useContactForm();

  return (
    <button
      type="button"
      onClick={openForm}
      className="mt-3 flex items-center gap-2.5 text-[14px] font-medium text-ink-strong transition-colors hover:text-primary-500"
    >
      <MessageSquare size={16} className="shrink-0 text-ink-soft" />
      Send me a message
    </button>
  );
}
