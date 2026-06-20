import ResetPasswordPage from "./reset-password-client";
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
    lang === "ar"
      ? "إعادة تعيين كلمة المرور | MyTaalim"
      : "Reset Password | MyTaalim";

  return createMetadata({
    title,
    path: "/reset-password",
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
      name: lang === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password",
      item: `https://www.mytaalim.xyz/${lang}/reset-password`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ResetPasswordPage />
    </>
  );
}
