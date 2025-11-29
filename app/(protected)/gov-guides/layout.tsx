"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function GovGuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
