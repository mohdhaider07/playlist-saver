import RegisterPage from "./register-client";
import { createMetadata, resolveLocale } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = getDictionary(resolveLocale(lang)).metadata.pages.register;

  return createMetadata({
    title: page.title,
    description: page.description,
    path: "/register",
    locale: lang,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);

  return (
    <>
      <BreadcrumbSchema
        locale={locale}
        name={getDictionary(locale).metadata.pages.register.title}
        path="/register"
      />
      <RegisterPage />
    </>
  );
}
