import ResetPasswordPage from "./reset-password-client";
import { createMetadata, resolveLocale } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = getDictionary(resolveLocale(lang)).metadata.pages.resetPassword;

  return createMetadata({
    title: page.title,
    description: page.description,
    path: "/reset-password",
    locale: lang,
    noIndex: true,
  });
}

export default function Page() {
  return <ResetPasswordPage />;
}
