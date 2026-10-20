"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/landing/hero-scene";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const { dictionary, direction } = useI18n();
  const t = dictionary.home;
  const isRtl = direction === "rtl";
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;
  const to = useLocalePath();

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
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
  };

  return (
    <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Three.js interactive Plexus background */}
      <HeroScene />

      {/* Ambient background glows tailored to theme */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.75)_0%,rgba(249,248,244,0.3)_60%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(28,25,22,0.7)_0%,rgba(28,25,22,0.2)_60%,transparent_100%)]" />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl select-none">
        {/* Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-primary/30 text-primary text-[10px] tracking-[0.25em] uppercase font-bold rounded-full bg-secondary/35 backdrop-blur-md"
        >
          <Sparkles size={11} className="animate-pulse" /> {t.heroBadge}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6 text-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        >
          {t.heroTitle} <br />
          <span className="italic font-normal text-muted-foreground">
            {t.heroTitleAccent}
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-10"
        >
          {t.heroDescription}
        </motion.p>

        {/* Call to Actions (Auth Aware) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14"
        >
          {isAuthenticated === true && (
            <>
              <Link href={to("/dashboard")}>
                <Button className="h-11 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                  {t.goToWorkspace} <ForwardArrow size={14} />
                </Button>
              </Link>
              <a
                href="#features"
                onClick={scrollToSection("features")}
                className="px-6 py-2.5 text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase cursor-pointer"
              >
                {t.exploreFeatures}
              </a>
            </>
          )}

          {isAuthenticated === false && (
            <>
              <Link href={to("/register")}>
                <Button className="h-11 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                  {t.startLearningFree} <ForwardArrow size={14} />
                </Button>
              </Link>
              <Link href={to("/login")}>
                <Button
                  variant="outline"
                  className="h-11 px-8 rounded-full border-border hover:bg-secondary font-semibold cursor-pointer"
                >
                  {t.signIn}
                </Button>
              </Link>
            </>
          )}

          {isAuthenticated === null && (
            <div className="h-11 w-44 rounded-full bg-secondary/50 animate-pulse border border-border" />
          )}
        </motion.div>

        {/* Discover arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex justify-center"
        >
          <a
            href="#features"
            onClick={scrollToSection("features")}
            className="group flex flex-col items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer uppercase"
          >
            <span>{t.discoverMore}</span>
            <span className="p-2 border border-border/80 rounded-full group-hover:border-primary/60 transition-colors bg-secondary/20 backdrop-blur-xs shadow-xs">
              <ArrowDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
            </span>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
