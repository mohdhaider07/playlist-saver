export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";
export const localeStorageKey = "playzen-locale";

export const localeLabels: Record<Locale, { short: string; native: string }> = {
  en: { short: "EN", native: "EN" },
  ar: { short: "AR", native: "العربية" },
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getLocaleDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getPathLocale(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return hasLocale(segment) ? segment : null;
}

export function stripLocale(pathname: string) {
  const locale = getPathLocale(pathname);
  if (!locale) return pathname || "/";

  const withoutLocale = pathname.slice(locale.length + 1);
  return withoutLocale.startsWith("/") ? withoutLocale || "/" : `/${withoutLocale}`;
}

export function getPreferredLocale(
  acceptLanguage: string | null,
  cookieLocale?: string | null,
): Locale {
  if (hasLocale(cookieLocale)) return cookieLocale;

  const accepted = (acceptLanguage || "")
    .split(",")
    .map((part) => {
      const [language, qValue] = part.trim().split(";q=");
      return {
        language: language.toLowerCase(),
        quality: qValue ? Number(qValue) : 1,
      };
    })
    .filter((item) => item.language)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of accepted) {
    if (language === "ar" || language.startsWith("ar-")) return "ar";
    if (language === "en" || language.startsWith("en-")) return "en";
  }

  return defaultLocale;
}

export function localizeHref(href: string, locale: Locale) {
  if (
    !href.startsWith("/") ||
    href.startsWith("/api") ||
    href.startsWith("/_next")
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = beforeHash.indexOf("?");
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  const pathname =
    queryIndex >= 0 ? beforeHash.slice(0, queryIndex) || "/" : beforeHash || "/";
  const cleanPathname = stripLocale(pathname);
  const localizedPathname =
    cleanPathname === "/" ? `/${locale}` : `/${locale}${cleanPathname}`;

  return `${localizedPathname}${query}${hash}`;
}
