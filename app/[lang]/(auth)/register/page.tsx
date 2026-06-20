import RegisterPage from "./register-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const title = lang === "ar" ? "إنشاء حساب | MyTaalim" : "Create Account | MyTaalim";

  return createMetadata({
    title,
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
  
  const breadcrumbs = [
    {
      name: lang === "ar" ? "الرئيسية" : "Home",
      item: `https://www.mytaalim.xyz/${lang}`,
    },
    {
      name: lang === "ar" ? "إنشاء حساب" : "Create Account",
      item: `https://www.mytaalim.xyz/${lang}/register`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <RegisterPage />
    </>
  );
}
