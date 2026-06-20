/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.mytaalim.xyz",
  generateRobotsTxt: true,
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
  ],
  robotsTxtOptions: {
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
