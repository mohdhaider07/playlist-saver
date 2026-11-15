"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";
import { cn } from "@/lib/utils";

function scrollToSection(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;

    window.scrollTo({
      top: elementPosition + window.pageYOffset - headerOffset,
      behavior: "smooth",
    });
  };
}

const styles = {
  primary:
    "bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 shadow-lg shadow-stone-900/10",
  secondary:
    "border border-border text-foreground hover:border-primary/60 hover:bg-secondary/60",
  quiet: "text-muted-foreground hover:text-foreground",
  skeleton: "bg-secondary/50 border-border",
};

const pill =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold transition-all duration-300 active:translate-y-px";

/** Auth-aware call-to-action pair for the landing hero. */
export function HeroActions({ className }: { className?: string }) {
  const { isAuthenticated } = useAuth();
  const { dictionary, direction } = useI18n();
  const t = dictionary.home;
  const to = useLocalePath();
  const ForwardArrow = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div
      className={cn(
        "flex flex-col items-stretch gap-3 sm:flex-row sm:items-center",
        className,
      )}
    >
      {isAuthenticated === true && (
        <>
          <Link href={to("/dashboard")} className={cn(pill, styles.primary)}>
            {t.goToWorkspace}
            <ForwardArrow
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </Link>
          <a
            href="#features"
            onClick={scrollToSection("features")}
            className={cn(
              "px-4 py-3 text-center text-xs font-bold uppercase tracking-widest transition-colors rtl:tracking-normal",
              styles.quiet,
            )}
          >
            {t.exploreFeatures}
          </a>
        </>
      )}

      {isAuthenticated === false && (
        <>
          <Link href={to("/register")} className={cn(pill, styles.primary)}>
            {t.startLearningFree}
            <ForwardArrow
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </Link>
          <Link
            href={to("/login")}
            className={cn(pill, "font-semibold", styles.secondary)}
          >
            {t.signIn}
          </Link>
        </>
      )}

      {isAuthenticated === null && (
        <div
          className={cn(
            "h-12 w-48 animate-pulse rounded-full border",
            styles.skeleton,
          )}
        />
      )}
    </div>
  );
}
