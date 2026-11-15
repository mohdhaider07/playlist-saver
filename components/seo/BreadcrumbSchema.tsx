import React from "react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedUrl } from "@/lib/seo";
import { JsonLdScript } from "@/components/seo/JsonLd";

interface BreadcrumbSchemaProps {
  locale: Locale;
  name: string;
  path: string;
}

export function BreadcrumbSchema({ locale, name, path }: BreadcrumbSchemaProps) {
  const items = [
    {
      name: getDictionary(locale).metadata.breadcrumbHome,
      item: localizedUrl(locale),
    },
    { name, item: localizedUrl(locale, path) },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item,
    })),
  };

  return <JsonLdScript data={schema} />;
}
