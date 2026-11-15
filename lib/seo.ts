import { Metadata } from "next";
import {
  Locale,
  defaultLocale,
  hasLocale,
  locales,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const siteConfig = {
  name: "MyTaalim",
  url: "https://www.mytaalim.xyz",
  logo: "/logo.png",
  // Used as the sitemap <lastmod>. Bump only when public page content changes,
  // so search engines keep trusting the value.
  lastUpdated: "2026-11-15",
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AR",
};

export function resolveLocale(lang: string): Locale {
  return hasLocale(lang) ? lang : defaultLocale;
}

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path}`;
}

export function localizedUrl(locale: Locale, path = "") {
  const cleanPath = path === "/" ? "" : path;
  return absoluteUrl(`/${locale}${cleanPath}`);
}

export function getLanguageAlternates(path = "") {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizedUrl(locale, path)]),
    ),
    "x-default": localizedUrl(defaultLocale, path),
  };
}

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
  locale: lang,
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const locale = resolveLocale(lang);
  const seo = getDictionary(locale).metadata;
  const currentTitle = title ? `${title} | ${siteConfig.name}` : seo.title;
  const currentDescription = description || seo.description;
  const canonicalUrl = localizedUrl(locale, path);
  // Static share cards rendered in a real browser (Satori cannot lay out Arabic).
  const shareImage = {
    url: absoluteUrl(`/og/mytaalim-${locale}.png`),
    width: 1200,
    height: 630,
    alt: seo.ogImageAlt,
    type: "image/png",
  };

  return {
    metadataBase: new URL(siteConfig.url),
    title: currentTitle,
    description: currentDescription,
    keywords: seo.keywords,
    applicationName: siteConfig.name,
    category: "education",
    alternates: {
      canonical: canonicalUrl,
      languages: getLanguageAlternates(path),
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: currentTitle,
      description: currentDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: currentTitle,
      description: currentDescription,
      images: [shareImage],
    },
  };
}
