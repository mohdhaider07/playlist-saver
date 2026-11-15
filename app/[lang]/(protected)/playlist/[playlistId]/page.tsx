import PlaylistPageClient from "./playlist-client";
import { createMetadata, resolveLocale } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; playlistId: string }>;
}): Promise<Metadata> {
  const { lang, playlistId } = await params;

  const title = getDictionary(resolveLocale(lang)).metadata.pages.playlist.title;

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
