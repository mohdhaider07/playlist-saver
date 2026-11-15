import ProfilePage from "./profile-client";
import { createMetadata, resolveLocale } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const title = getDictionary(resolveLocale(lang)).metadata.pages.profile.title;

  return createMetadata({
    title,
    path: "/profile",
    locale: lang,
    noIndex: true,
  });
}

export default function Page() {
  return <ProfilePage />;
}
