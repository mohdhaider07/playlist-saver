import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo";

const privatePaths = ["/dashboard", "/profile", "/playlist"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        ...locales.flatMap((locale) =>
          privatePaths.map((path) => `/${locale}${path}`),
        ),
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
