import ForgotPasswordPage from "./forgot-password-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const title =
    lang === "ar" ? "نسيت كلمة المرور | MyTaalim" : "Forgot Password | MyTaalim";

  return createMetadata({
    title,
    path: "/forgot-password",
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
      name: lang === "ar" ? "نسيت كلمة المرور" : "Forgot Password",
      item: `https://www.mytaalim.xyz/${lang}/forgot-password`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ForgotPasswordPage />
    </>
  );
}
