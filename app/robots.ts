import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/en/dashboard",
        "/ar/dashboard",
        "/en/profile",
        "/ar/profile",
        "/en/playlist",
        "/ar/playlist",
      ],
    },
    sitemap: "https://www.mytaalim.xyz/sitemap.xml",
  };
}
