"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/landing/hero-scene";
import { MiniDemo } from "@/components/landing/mini-demo";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Video,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* 1. HERO SECTION WITH 3D MOTION BACKGROUND */}
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
            <Sparkles size={11} className="animate-pulse" /> Focus-Driven Learning Workspace
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6 text-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
          >
            Elevate Your Study. <br />
            <span className="italic font-normal text-muted-foreground">Master Your Playlists.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-10"
          >
            Connect any YouTube playlist, strip away distractions, check off your chapters, and track your watch progress in a premium dashboard.
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
                <Link href="/dashboard">
                  <Button className="h-11 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                    Go to Workspace <ArrowRight size={14} />
                  </Button>
                </Link>
                <a
                  href="#features"
                  onClick={scrollToSection("features")}
                  className="px-6 py-2.5 text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase cursor-pointer"
                >
                  Explore Features
                </a>
              </>
            )}

            {isAuthenticated === false && (
              <>
                <Link href="/register">
                  <Button className="h-11 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                    Start Learning Free <ArrowRight size={14} />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-11 px-8 rounded-full border-border hover:bg-secondary font-semibold cursor-pointer"
                  >
                    Sign In
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
              <span>Discover More</span>
              <span className="p-2 border border-border/80 rounded-full group-hover:border-primary/60 transition-colors bg-secondary/20 backdrop-blur-xs shadow-xs">
                <ArrowDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
              </span>
            </a>
          </motion.div>
        </div>
      </header>

      <main>
        
        {/* 2. PRODUCT HIGHLIGHTS SECTION */}
        <section id="features" className="py-24 bg-card border-t border-border/65 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            
            {/* Section Title */}
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                Why Playzen?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Distraction-Free Environment Built for Online Study
              </h2>
              <div className="w-12 h-0.5 bg-primary/80 mx-auto mt-4"></div>
            </div>

            {/* Grid of highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Feature 1 */}
              <div className="space-y-4 p-5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <BookOpen size={18} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Quiet Workspace
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  No video suggestions, comments, or banner advertisements. Zero distractions between you and your syllabus.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4 p-5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Video size={18} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Smart Playback
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Smooth auto-advancing players that queue up the next chapter in your course instantly once the previous one is finished.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4 p-5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Step Progress
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Track completed segments, in-progress lectures, and overall syllabus percentages directly on your personal dashboard.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="space-y-4 p-5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <TrendingUp size={18} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Visual Statistics
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Stay motivated with clear metric graphs outlining total videos, completed tasks, and average course progress.
                </p>
              </div>

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
                  Workflow Phase 1
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
                  Seamless Playlist Syncing
                </h2>
                <div className="w-12 h-0.5 bg-primary/80"></div>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Playzen makes it incredibly simple to organize your resources. By copying and pasting a standard YouTube playlist URL into the workspace, our application immediately connects and pulls in the material.
                </p>

                {/* Steps Details */}
                <div className="space-y-4 pt-2">
                  <div className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Paste Public URL
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">
                        Grab the share link of any instructional playlist from YouTube.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Instant Parsing
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">
                        We compile video count, runtimes, channel credits, and thumbnails in seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Course Generated
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">
                        The playlist appears as a beautiful modular course card in your dashboard lobby.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image side */}
              <div className="lg:col-span-7">
                <div className="relative p-2 bg-card border border-border/80 rounded-2xl shadow-lg shadow-primary/5 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/dashboard.png"
                    alt="Playzen Dashboard Workspace"
                    className="w-full h-auto rounded-xl object-cover"
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
                    src="/images/playlist.png"
                    alt="Playzen Playlist Playback"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase block">
                  Workflow Phase 2
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
                  The Focused Study Room
                </h2>
                <div className="w-12 h-0.5 bg-primary/80"></div>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Step inside your customized playback theater. Here, we present the video and playlist sidebar side-by-side. Our integrated tracker communicates directly with the embed to save progress in real-time.
                </p>

                {/* Feature details bullets */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      Time-stamp Auto-Recall
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      Smart Autoplay Next Lesson
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      Description & Notebook Side Panels
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      Clean Widescreen Layout
                    </span>
                  </div>
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
                Playground Demo
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Experience Playzen in Action
              </h2>
              <div className="w-12 h-0.5 bg-primary/80 mx-auto mt-4"></div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light max-w-md mx-auto">
                Interact with the mock simulator below to preview playlist syncing and automated watch state updates.
              </p>
            </div>

            <MiniDemo />
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
              &quot;Online courses on YouTube are gold mines, but the platform is built to distract. Playzen turns noise into a structured, silent university study hall. It has completely transformed my learning efficiency.&quot;
            </blockquote>
            <div className="space-y-1.5">
              <cite className="text-xs font-bold text-primary tracking-widest uppercase not-italic block">
                — Playzen User Community
              </cite>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                YouTube Self-Education Space
              </span>
            </div>
          </div>
        </section>

        {/* 7. FINAL CALL TO ACTION */}
        <section className="py-24 bg-background border-t border-border/70 relative z-10">
          <div className="container mx-auto px-6 max-w-4xl text-center select-none space-y-8">
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-foreground leading-tight">
              Ready to Structure Your Learning?
            </h2>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Join thousands of students and developers who use Playzen to organize tutorials, course bundles, and learning logs.
            </p>
            <div>
              {isAuthenticated === true ? (
                <Link href="/dashboard">
                  <Button className="h-12 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                    Enter Dashboard Workspace <ArrowUpRight size={15} />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button className="h-12 px-8 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-md gap-2 border-none cursor-pointer">
                    Create Free Account <ArrowRight size={15} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* 8. FOOTER */}
      <footer className="bg-card text-muted-foreground py-16 border-t border-border/80 relative z-10 select-none">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-serif font-bold text-xl text-foreground tracking-wide">
                PLAYZEN
              </span>
            </div>
            <p className="text-xs text-muted-foreground/75 font-light">
              Structured workspace for YouTube courses and tracking progress.
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
            <Link href="/login" className="hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-primary transition-colors">
              Register
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Github
            </a>
          </div>

        </div>
        
        <div className="text-center mt-12 text-[10px] text-muted-foreground/50 font-mono">
          © {new Date().getFullYear()} Playzen. All rights reserved. Created in partnership with Advanced Agentic Coding.
        </div>
      </footer>
      
    </div>
  );
}
