"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
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
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

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
          href="/"
          onClick={() => {
            if (isHome) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center cursor-pointer select-none group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Playzen Logo"
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
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
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={scrollToSection("how-it-works")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#mini-demo"
              onClick={scrollToSection("mini-demo")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Interactive Simulator
            </a>
          </div>
        )}

        {/* Right Side: Auth buttons / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated === true && (
            <>
              {isHome && (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/profile" className="flex items-center">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-serif font-bold shadow-sm select-none border border-white/5 pb-[2px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                  {userInitial}
                </div>
              </Link>
            </>
          )}

          {isAuthenticated === false && (
            <div className="flex gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-muted-foreground hover:text-foreground font-semibold"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 px-5 bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full transition-colors shadow-sm font-semibold border-none"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        {isHome && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && isHome && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-sm font-serif animate-fade-in md:hidden select-none">
          <a
            href="#features"
            onClick={scrollToSection("features")}
            className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={scrollToSection("how-it-works")}
            className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
          >
            How It Works
          </a>
          <a
            href="#mini-demo"
            onClick={scrollToSection("mini-demo")}
            className="text-foreground/85 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-lg font-bold"
          >
            Interactive Simulator
          </a>
          <div className="w-16 h-px bg-border my-2"></div>
          {isAuthenticated === true ? (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              <Button size="lg" className="px-8 rounded-full bg-foreground text-background font-bold border-none shadow-md">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-4 w-full max-w-[200px]">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full text-center">
                <Button variant="outline" className="w-full rounded-full font-bold">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="w-full text-center">
                <Button className="w-full rounded-full bg-foreground text-background font-bold border-none shadow-md">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
