import HomeClient from "./home-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const title =
    lang === "ar"
      ? "MyTaalim | منصة لتنظيم قوائم تشغيل يوتيوب"
      : "MyTaalim | YouTube Playlist Learning Workspace";

  const description =
    lang === "ar"
      ? "نظم قوائم تشغيل يوتيوب وتابع تقدمك الدراسي في بيئة تعلم خالية من المشتتات."
      : "Organize YouTube playlists, remove distractions, and track learning progress with a focused study workspace.";

  return createMetadata({
    title,
    description,
    path: "/",
    locale: lang,
  });
}

export default function Page() {
  return <HomeClient />;
}
