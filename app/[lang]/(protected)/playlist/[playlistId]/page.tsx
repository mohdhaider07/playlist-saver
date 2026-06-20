import PlaylistPageClient from "./playlist-client";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; playlistId: string }>;
}): Promise<Metadata> {
  const { lang, playlistId } = await params;
  
  const title = lang === "ar" ? "قائمة التشغيل | MyTaalim" : "Playlist | MyTaalim";

  return createMetadata({
    title,
    path: `/playlist/${playlistId}`,
    locale: lang,
    noIndex: true,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; playlistId: string }>;
}) {
  const { playlistId } = await params;
  return <PlaylistPageClient playlistId={playlistId} />;
}
