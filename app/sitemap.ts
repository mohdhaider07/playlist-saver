import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import {
  absoluteUrl,
  getLanguageAlternates,
  localizedUrl,
  siteConfig,
} from "@/lib/seo";

// Only public, indexable pages. Auth utility pages (callback, forgot/reset
// password) are noindex and protected pages are blocked in robots.ts.
const publicRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/register", changeFrequency: "monthly", priority: 0.8 },
  { path: "/login", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: siteConfig.lastUpdated,
      changeFrequency,
      priority,
      alternates: { languages: getLanguageAlternates(path) },
      ...(path === "" && {
        images: [
          absoluteUrl(`/images/dashboard-${locale}-light.webp`),
          absoluteUrl(`/images/playlist-${locale}-light.webp`),
        ],
      }),
    })),
  );
}
