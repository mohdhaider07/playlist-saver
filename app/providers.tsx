"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { I18nProvider } from "@/components/i18n-provider";
import { Locale } from "@/lib/i18n/config";
import { Dictionary } from "@/lib/i18n/dictionaries";

export function ClientProviders({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <AuthProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
      </AuthProvider>
    </I18nProvider>
  );
}
