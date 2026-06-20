import LoginPage from "./login-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const title = lang === "ar" ? "تسجيل الدخول | MyTaalim" : "Sign In | MyTaalim";

  return createMetadata({
    title,
    path: "/login",
    locale: lang,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  const breadcrumbs = [
    {
      name: lang === "ar" ? "الرئيسية" : "Home",
      item: `https://www.mytaalim.xyz/${lang}`,
    },
    {
      name: lang === "ar" ? "تسجيل الدخول" : "Sign In",
      item: `https://www.mytaalim.xyz/${lang}/login`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <LoginPage />
    </>
  );
}
