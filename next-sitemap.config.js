/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.mytaalim.xyz",

  generateRobotsTxt: true,
  generateIndexSitemap: false,

  sitemapSize: 7000,

  transform: async (config, path) => {
    // Strip existing locale prefix from the path, e.g. /ar/login -> /login
    const pathWithoutLocale = path.replace(/^\/(en|ar)(\/|$)/, "/");
    const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${config.siteUrl}/en${cleanPath}`,
          hreflang: "en",
          hrefIsAbsolute: true,
        },
        {
          href: `${config.siteUrl}/ar${cleanPath}`,
          hreflang: "ar",
          hrefIsAbsolute: true,
        },
      ],
    };
  },

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