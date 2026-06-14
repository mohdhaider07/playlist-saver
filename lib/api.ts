import {
  Locale,
  getPathLocale,
  hasLocale,
  localeStorageKey,
} from "@/lib/i18n/config";
import { getDictionary, localizeServerMessage } from "@/lib/i18n/dictionaries";

function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const pathLocale = getPathLocale(window.location.pathname);
  if (pathLocale) return pathLocale;

  const storedLocale = localStorage.getItem(localeStorageKey);
  return hasLocale(storedLocale) ? storedLocale : "en";
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const locale = getBrowserLocale();
  if (!headers.has("Accept-Language")) {
    headers.set("Accept-Language", locale);
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (data?.message && typeof data.message === "string") {
    data.message = localizeServerMessage(data.message, locale);
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Dispatch an event to handle unauthorized access across the app
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized"));
      }
    }
    const message =
      typeof data?.error === "string"
        ? localizeServerMessage(data.error, locale)
        : getDictionary(locale).api.unexpected;
    throw new Error(message);
  }

  return data;
}
