"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 left-0 w-full h-16 glass-nav flex items-center justify-between px-6 z-50 border-b border-border/80 shadow-sm">
      <Link
        href="/"
        className="flex items-center cursor-pointer select-none group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Playzen Logo"
          className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
        />
      </Link>

      <div>
        {isAuthenticated === true && (
          <Link href="/profile" className="flex items-center">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-serif font-bold shadow-sm select-none border border-white/5 pb-[2px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              {userInitial}
            </div>
          </Link>
        )}
        {isAuthenticated === false && (
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-9 px-5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-muted-foreground hover:text-foreground font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="h-9 px-5 bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full transition-colors shadow-sm font-semibold border-none">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

