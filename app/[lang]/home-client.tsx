"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/hero-section";
import { MiniDemo } from "@/components/landing/mini-demo";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Video,
  CheckCircle2,
  TrendingUp,
  ArrowUpLeft,
  ArrowUpRight,
} from "lucide-react";

const featureIcons = [BookOpen, Video, CheckCircle2, TrendingUp];

export default function HomeClient() {
  const { isAuthenticated } = useAuth();
  const { dictionary, direction, locale } = useI18n();
  const t = dictionary.home;
  const isRtl = direction === "rtl";
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;
  const DiagonalForwardArrow = isRtl ? ArrowUpLeft : ArrowUpRight;
  const to = useLocalePath();



  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* 1. HERO SECTION WITH 3D MOTION BACKGROUND */}
      <HeroSection />

      <main>
        
        {/* 2. PRODUCT HIGHLIGHTS SECTION */}
        <section id="features" className="py-24 bg-card border-t border-border/65 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            
            {/* Section Title */}
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                {t.why}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                {t.featuresTitle}
              </h2>
              <div className="w-12 h-0.5 bg-primary/80 mx-auto mt-4"></div>
            </div>

            {/* Grid of highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.featureCards.map((feature, index) => {
                const Icon = featureIcons[index];

                return (
                  <div
                    key={feature.title}
                    className="space-y-4 p-5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. SHOWCASE SECTION 1: HOW WE ARE ADDING THE PLAYLIST */}
        <section id="how-it-works" className="py-24 bg-background border-t border-border/60 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text side */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                  {t.workflowOne.eyebrow}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
                  {t.workflowOne.title}
                </h2>
                <div className="w-12 h-0.5 bg-primary/80"></div>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {t.workflowOne.description}
                </p>

                {/* Steps Details */}
                <div className="space-y-4 pt-2">
                  {t.workflowOne.steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-light mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image side */}
              <div className="lg:col-span-7">
                <div className="relative p-2 bg-card border border-border/80 rounded-2xl shadow-lg shadow-primary/5 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/dashboard-${locale}-light.webp`}
                    alt={t.workflowOne.dashboardAlt}
                    width={1600}
                    height={1123}
                    loading="lazy"
                    className="w-full h-auto rounded-xl object-cover dark:hidden"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/dashboard-${locale}-dark.webp`}
                    alt={t.workflowOne.dashboardAlt}
                    width={1600}
                    height={1123}
                    loading="lazy"
                    className="w-full h-auto rounded-xl object-cover hidden dark:block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. SHOWCASE SECTION 2: HOW YOU CAN PLAY THE VIDEO */}
        <section className="py-24 bg-card border-t border-border/60 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Image side */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="relative p-2 bg-background border border-border/80 rounded-2xl shadow-lg shadow-primary/5 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/playlist-${locale}-light.webp`}
                    alt={t.workflowTwo.playlistAlt}
                    width={1600}
                    height={1123}
                    loading="lazy"
                    className="w-full h-auto rounded-xl object-cover dark:hidden"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/playlist-${locale}-dark.webp`}
                    alt={t.workflowTwo.playlistAlt}
                    width={1600}
                    height={1123}
                    loading="lazy"
                    className="w-full h-auto rounded-xl object-cover hidden dark:block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                  {t.workflowTwo.eyebrow}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
                  {t.workflowTwo.title}
                </h2>
                <div className="w-12 h-0.5 bg-primary/80"></div>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {t.workflowTwo.description}
                </p>

                {/* Feature details bullets */}
                <div className="space-y-4 pt-2">
                  {t.workflowTwo.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE WIDGET DEMO SECTION */}
        <section id="mini-demo" className="py-24 bg-background border-t border-border/60 relative z-10">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                {t.demo.eyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                {t.demo.title}
              </h2>
              <div className="w-12 h-0.5 bg-primary/80 mx-auto mt-4"></div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light max-w-md mx-auto">
                {t.demo.description}
              </p>
            </div>

            <MiniDemo key={locale} />
          </div>
        </section>

        {/* 6. TESTIMONIAL/BRAND QUOTE SECTION */}
        <section className="py-28 bg-stone-900 text-stone-100 overflow-hidden relative border-t border-stone-850">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
            <div className="w-96 h-96 rounded-full bg-stone-700 blur-[120px] absolute -top-40 -left-40"></div>
            <div className="w-96 h-96 rounded-full bg-primary blur-[120px] absolute -bottom-40 -right-40"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-3xl text-center select-none space-y-6">
            <div className="w-10 h-0.5 bg-primary/85 mx-auto"></div>
            <blockquote className="font-serif italic text-2xl sm:text-3xl text-stone-200 leading-relaxed font-light">
              &quot;{t.quote}&quot;
            </blockquote>
            <div className="space-y-1.5">
              <cite className="text-xs font-bold text-primary tracking-widest uppercase not-italic block">
                {t.quoteBy}
              </cite>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                {t.quoteSpace}
              </span>
            </div>
          </div>
        </section>

        {/* 7. FINAL CALL TO ACTION */}
        <section className="py-24 bg-background border-t border-border/70 relative z-10">
          <div className="container mx-auto px-6 max-w-4xl text-center select-none space-y-8">
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-foreground leading-tight">
              {t.finalTitle}
            </h2>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {t.finalDescription}
            </p>
            <div>
              {isAuthenticated === true ? (
                <Link href={to("/dashboard")}>
                  <Button className="h-12 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                    {t.enterDashboard} <DiagonalForwardArrow size={15} />
                  </Button>
                </Link>
              ) : (
                <Link href={to("/register")}>
                  <Button className="h-12 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                    {t.createFreeAccount} <ForwardArrow size={15} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* 8. FOOTER */}
      <footer className="bg-card text-muted-foreground py-16 border-t border-border/80 relative z-10 select-none">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-start">
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-light.png"
                alt="MyTaalim Logo"
                className="h-16 w-auto object-contain dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-dark.png"
                alt="MyTaalim Logo"
                className="h-16 w-auto object-contain hidden dark:block"
              />
            </div>
            <p className="text-xs text-muted-foreground/75 font-light">
              {t.footerDescription}
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
            <Link href={to("/login")} className="hover:text-primary transition-colors">
              {t.footerSignIn}
            </Link>
            <Link href={to("/register")} className="hover:text-primary transition-colors">
              {t.footerRegister}
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {t.footerGithub}
            </a>
          </div>

        </div>
        
        <div className="text-center mt-12 text-[10px] text-muted-foreground/50 font-mono">
          © {new Date().getFullYear()} {t.copyrightSuffix}
        </div>
      </footer>
      
    </div>
  );
}
