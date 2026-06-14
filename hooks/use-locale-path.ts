"use client";

import { localizeHref } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n-provider";

export function useLocalePath() {
  const { locale } = useI18n();

  return (href: string) => localizeHref(href, locale);
}
