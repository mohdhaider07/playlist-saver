"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import {
  Locale,
  localeLabels,
  locales,
  localizeHref,
  stripLocale,
} from "@/lib/i18n/config";

function LocaleSwitcher({ onSwitch }: { onSwitch?: () => void }) {
  const { locale, dictionary } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = stripLocale(pathname || "/");

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const query = window.location.search;
    const hash = window.location.hash;
    onSwitch?.();
    router.push(localizeHref(`${currentPath}${query}${hash}`, nextLocale));
  };

  return (
    <div
      aria-label={dictionary.nav.language}
      className="inline-flex h-9 items-center rounded-full border border-border bg-secondary/40 p-1 shadow-xs"
      role="group"
    >
      {locales.map((item) => {
        const active = item === locale;
        const label =
          item === "ar" ? localeLabels[item].native : localeLabels[item].short;

        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            lang={item}
            dir={item === "ar" ? "rtl" : "ltr"}
            onClick={() => switchLocale(item)}
            className={`h-7 min-w-10 rounded-full px-3 text-[10px] font-bold transition-all ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { dictionary, locale } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const to = (href: string) => localizeHref(href, locale);

  const isHome = stripLocale(pathname || "/") === "/";
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "glass-nav shadow-sm border-b border-border/80"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Left Side: Logo */}
        <Link
          href={to("/")}
          onClick={() => {
            if (isHome) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center cursor-pointer select-none group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-light.png"
            alt="MyTaalim Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102 dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-dark.png"
            alt="MyTaalim Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102 hidden dark:block"
          />
        </Link>

        {/* Center: Navigation Links (Only shown on homepage) */}
        {isHome && (
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <a
              href="#features"
              onClick={scrollToSection("features")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {dictionary.nav.features}
            </a>
            <a
              href="#how-it-works"
              onClick={scrollToSection("how-it-works")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {dictionary.nav.howItWorks}
            </a>
            <a
              href="#mini-demo"
              onClick={scrollToSection("mini-demo")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {dictionary.nav.interactiveSimulator}
            </a>
          </div>
        )}

        {/* Right Side: Auth buttons / Profile */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          {isAuthenticated === true && (
            <>
              {isHome && (
                <Link href={to("/dashboard")}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-muted-foreground hover:text-foreground font-semibold"
                  >
                    {dictionary.nav.dashboard}
                  </Button>
                </Link>
              )}
              <Link href={to("/profile")} className="flex items-center">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-serif font-bold shadow-sm select-none border border-white/5 pb-[2px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                  {userInitial}
                </div>
              </Link>
            </>
          )}

          {isAuthenticated === false && (
            <div className="flex gap-3">
              <Link href={to("/login")}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-muted-foreground hover:text-foreground font-semibold"
                >
                  {dictionary.nav.login}
                </Button>
              </Link>
              <Link href={to("/register")}>
                <Button
                  size="sm"
                  className="h-9 px-5 bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full transition-colors shadow-sm font-semibold border-none"
                >
                  {dictionary.nav.signUp}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher onSwitch={() => setMenuOpen(false)} />
          {isAuthenticated === true && !isHome && (
            <Link href={to("/profile")} className="flex items-center ml-2">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-serif font-bold shadow-sm select-none border border-white/5 pb-[2px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                {userInitial}
              </div>
            </Link>
          )}
          {isHome && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && isHome && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-sm font-serif animate-fade-in md:hidden select-none">
          <a
            href="#features"
            onClick={scrollToSection("features")}
            className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
          >
            {dictionary.nav.features}
          </a>
          <a
            href="#how-it-works"
            onClick={scrollToSection("how-it-works")}
            className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
          >
            {dictionary.nav.howItWorks}
          </a>
          <a
            href="#mini-demo"
            onClick={scrollToSection("mini-demo")}
            className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
          >
            {dictionary.nav.interactiveSimulator}
          </a>
          <div className="w-16 h-px bg-border my-2"></div>
          {isAuthenticated === true ? (
            <>
              <Link
                href={to("/dashboard")}
                onClick={() => setMenuOpen(false)}
                className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
              >
                {dictionary.nav.dashboard}
              </Link>
              <Link
                href={to("/profile")}
                onClick={() => setMenuOpen(false)}
                className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
              >
                {dictionary.nav.profile}
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-4 w-full max-w-[200px]">
              <Link
                href={to("/login")}
                onClick={() => setMenuOpen(false)}
                className="w-full text-center"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full font-bold"
                >
                  {dictionary.nav.login}
                </Button>
              </Link>
              <Link
                href={to("/register")}
                onClick={() => setMenuOpen(false)}
                className="w-full text-center"
              >
                <Button className="w-full rounded-full bg-foreground text-background font-bold border-none shadow-md">
                  {dictionary.nav.signUp}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
