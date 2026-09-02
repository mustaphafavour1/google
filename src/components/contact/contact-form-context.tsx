"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ContactFormContextValue = {
  open: boolean;
  openForm: () => void;
  closeForm: () => void;
};

const ContactFormContext = createContext<ContactFormContextValue | null>(null);

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({ open, openForm: () => setOpen(true), closeForm: () => setOpen(false) }),
    [open],
  );

  return <ContactFormContext.Provider value={value}>{children}</ContactFormContext.Provider>;
}

export function useContactForm() {
  const ctx = useContext(ContactFormContext);
  if (!ctx) throw new Error("useContactForm must be used within a ContactFormProvider");
  return ctx;
}
