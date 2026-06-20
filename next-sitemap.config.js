/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.mytaalim.xyz",

  generateRobotsTxt: true,

  sitemapSize: 7000,

  alternateRefs: [
    {
      href: "https://www.mytaalim.xyz/en",
      hreflang: "en",
    },
    {
      href: "https://www.mytaalim.xyz/ar",
      hreflang: "ar",
    },
  ],

  exclude: [
    "/*/dashboard",
    "/*/dashboard/*",
    "/*/profile",
    "/*/profile/*",
    "/*/playlist",
    "/*/playlist/*",

    "/icon.png",
    "/robots.txt"
  ],

  robotsTxtOptions: {
    includeNonIndexSitemaps: true,

    policies: [
      {
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
    ],
  },
};