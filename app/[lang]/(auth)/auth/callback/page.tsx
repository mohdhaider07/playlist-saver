import { Suspense } from "react";
import { Metadata } from "next";
import AuthCallbackClient from "./callback-client";
import { createMetadata, resolveLocale } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return createMetadata({
    title: getDictionary(resolveLocale(lang)).metadata.pages.authCallback.title,
    path: "/auth/callback",
    locale: lang,
    noIndex: true,
  });
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
