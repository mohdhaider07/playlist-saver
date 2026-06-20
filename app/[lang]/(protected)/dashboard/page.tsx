import DashboardPage from "./dashboard-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const title = lang === "ar" ? "لوحة التحكم | MyTaalim" : "Dashboard | MyTaalim";

  return createMetadata({
    title,
    path: "/dashboard",
    locale: lang,
    noIndex: true,
  });
}

export default function Page() {
  return <DashboardPage />;
}
