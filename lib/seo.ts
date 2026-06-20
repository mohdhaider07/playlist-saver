import { Metadata } from "next";

export const siteConfig = {
  name: "MyTaalim",
  url: "https://www.mytaalim.xyz",
  description:
    "Organize YouTube playlists and track learning progress without distractions.",
  keywords: [
    // English
    "youtube playlist manager",
    "youtube learning tracker",
    "study workspace",
    "course organizer",
    "track youtube progress",
    // Arabic
    "إدارة قوائم تشغيل يوتيوب",
    "منصة تعلم",
    "تنظيم الدورات التعليمية",
    "تتبع مشاهدة يوتيوب",
    "منصة تعليم",
  ],
};

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  path: string;
  locale: string;
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description,
  path,
  locale,
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const currentTitle = title ? `${title}` : siteConfig.name;
  const currentDescription = description || siteConfig.description;
  const cleanPath = path === "/" ? "" : path;
  const canonicalUrl = `${siteConfig.url}/${locale}${cleanPath}`;

  return {
    title: currentTitle,
    description: currentDescription,
    keywords: siteConfig.keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en${cleanPath}`,
        ar: `${siteConfig.url}/ar${cleanPath}`,
        "x-default": `${siteConfig.url}/en${cleanPath}`,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title: currentTitle,
      description: currentDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: currentTitle,
      description: currentDescription,
    },
  };
}
