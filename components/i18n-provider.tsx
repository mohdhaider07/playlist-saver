"use client";

import React, { createContext, useContext, useEffect } from "react";
import {
  Locale,
  getLocaleDirection,
  localeCookieName,
  localeStorageKey,
} from "@/lib/i18n/config";
import { Dictionary, dictionaries } from "@/lib/i18n/dictionaries";

type I18nContextType = {
  locale: Locale;
  direction: "ltr" | "rtl";
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  direction: "ltr",
  dictionary: dictionaries.en,
});

export function I18nProvider({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const direction = getLocaleDirection(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    localStorage.setItem(localeStorageKey, locale);
    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [direction, locale]);

  return (
    <I18nContext.Provider value={{ locale, direction, dictionary }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
