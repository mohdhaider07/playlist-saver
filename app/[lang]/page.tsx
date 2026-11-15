import HomeClient from "./home-client";
import { createMetadata, resolveLocale } from "@/lib/seo";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return createMetadata({
    path: "/",
    locale: lang,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <JsonLd locale={resolveLocale(lang)} />
      <HomeClient />
    </>
  );
}
