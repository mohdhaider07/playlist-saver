import ProfilePage from "./profile-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const title = lang === "ar" ? "الملف الشخصي | MyTaalim" : "Profile | MyTaalim";

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
