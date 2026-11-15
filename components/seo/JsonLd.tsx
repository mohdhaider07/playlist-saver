import React from "react";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { absoluteUrl, localizedUrl, siteConfig } from "@/lib/seo";

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function JsonLd({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const seo = dictionary.metadata;
  const pageUrl = localizedUrl(locale);
  const organizationId = absoluteUrl("/#organization");
  const websiteId = absoluteUrl("/#website");
  const applicationId = absoluteUrl("/#webapp");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.logo),
          width: 1125,
          height: 365,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        alternateName: ["My Taalim", "ماي تعليم"],
        url: absoluteUrl("/"),
        inLanguage: [...locales],
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebApplication",
        "@id": applicationId,
        name: siteConfig.name,
        url: pageUrl,
        description: seo.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript and a modern web browser.",
        inLanguage: [...locales],
        isAccessibleForFree: true,
        featureList: seo.featureList,
        screenshot: [
          absoluteUrl(`/images/dashboard-${locale}-light.webp`),
          absoluteUrl(`/images/playlist-${locale}-light.webp`),
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": applicationId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(`/images/dashboard-${locale}-light.webp`),
          caption: dictionary.home.workflowOne.dashboardAlt,
        },
      },
    ],
  };

  return <JsonLdScript data={schema} />;
}
