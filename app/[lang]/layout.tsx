import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { ClientProviders } from "../providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Locale,
  getLocaleDirection,
  hasLocale,
  locales,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "en";
  const dictionary = getDictionary(locale);

  return createMetadata({
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    path: "",
    locale,
  });
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale: Locale = lang;
  const direction = getLocaleDirection(locale);
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd />
        <ClientProviders locale={locale} dictionary={dictionary}>
          {children}
        </ClientProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

