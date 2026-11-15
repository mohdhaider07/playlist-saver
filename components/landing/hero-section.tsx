"use client";

import React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Check, Play } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { HeroActions } from "@/components/landing/hero-actions";
import { ProductShot } from "@/components/landing/product-shot";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function RevealLine({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden py-[0.08em]">
      <motion.span
        className={cn("block", className)}
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.95, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** A card hovering in front of the product shot: pops in, then drifts. */
function FloatingCard({
  children,
  depth,
  delay,
  drift,
  className,
}: {
  children: React.ReactNode;
  depth: number;
  delay: number;
  drift: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      style={{ z: depth }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease, delay }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -drift, 0] }}
        transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Editorial split: masthead typography on one side, a layered 3D composition
 * of the real product on the other that leans toward the cursor.
 */
export function HeroSection() {
  const { dictionary, direction } = useI18n();
  const t = dictionary.home;
  const cards = t.heroCards;
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 18 });
  // The composition always leans toward the text column
  const lean = isRtl ? 13 : -13;
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [lean - 5, lean + 5]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9, 3]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <header
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative overflow-hidden"
    >
      {/* Backdrop: column guides, gold light, orbit rings, grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:8.3333%_100%] opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_70%,transparent)]" />
        <div className="hero-aurora absolute -end-40 top-[6%] size-[46rem] rounded-full bg-primary/20 blur-[130px] dark:bg-primary/12" />
        <div className="absolute -start-32 bottom-0 size-96 rounded-full bg-stone-400/15 blur-[110px] dark:bg-stone-600/15" />
        <div className="absolute end-[4%] top-1/2 hidden size-[38rem] -translate-y-1/2 rounded-full border border-primary/20 lg:block" />
        <div className="absolute -end-[6%] top-1/2 hidden size-[54rem] -translate-y-1/2 rounded-full border border-primary/10 lg:block" />
        <div className="hero-grain absolute inset-0 opacity-[0.08] mix-blend-multiply dark:mix-blend-soft-light" />
      </div>

      <div className="relative z-10 container mx-auto grid min-h-(--hero-vh) max-w-7xl items-center gap-20 px-6 pt-28 pb-24 lg:grid-cols-12 lg:gap-10 lg:pt-24 lg:pb-14">
        {/* Masthead */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] rtl:tracking-normal"
          >
            <span className="h-px w-10 shrink-0 bg-primary" />
            <span className="shrink-0 font-serif text-sm font-semibold whitespace-nowrap normal-case italic tracking-normal text-primary">
              {t.heroEdition}
            </span>
            <span className="text-muted-foreground">{t.heroBadge}</span>
          </motion.div>

          <h1 className="font-serif text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl xl:text-7xl rtl:leading-[1.3] rtl:tracking-normal">
            <RevealLine delay={0.1}>{t.heroTitle}</RevealLine>
            <RevealLine
              delay={0.24}
              className="text-gold-shimmer mt-1 pe-2 text-[0.6em] font-normal leading-[1.18] italic rtl:leading-[1.5] rtl:not-italic"
            >
              {t.heroTitleAccent}
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="mt-8 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
          >
            {t.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.58 }}
          >
            <HeroActions className="mt-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-border border-t border-border pt-6"
          >
            {t.heroFacts.map((fact) => (
              <div key={fact.label} className="px-4 first:ps-0 last:pe-0">
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {fact.value}
                </p>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                  {fact.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Product composition */}
        <div className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-2xl [perspective:1800px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -70 : 70 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.3 }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative lg:w-[128%]"
            >
              <ProductShot
                view="dashboard"
                className="shadow-[0_50px_100px_-30px_rgba(41,37,36,0.45)] dark:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]"
              />

              {/* Study room, lifted off the dashboard */}
              <FloatingCard
                depth={70}
                delay={0.7}
                drift={8}
                className="-start-3 -bottom-10 w-[50%] sm:-start-8 lg:-start-14"
              >
                <ProductShot
                  view="playlist"
                  className="rounded-xl shadow-2xl shadow-stone-900/30"
                />
              </FloatingCard>

              {/* Course progress */}
              <FloatingCard
                depth={110}
                delay={1}
                drift={12}
                className="-top-9 start-[5%]"
              >
                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/90 p-3 pe-5 shadow-xl shadow-stone-900/15 backdrop-blur-xl">
                  <div className="relative size-14">
                    <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        strokeWidth="4"
                        className="stroke-secondary"
                      />
                      <motion.circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="stroke-primary"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 0.61 }}
                        transition={{ duration: 1.8, ease, delay: 1.3 }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-sm font-bold text-foreground">
                      61%
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground rtl:tracking-normal">
                      {cards.progressLabel}
                    </p>
                    <p className="mt-0.5 font-serif text-base font-semibold whitespace-nowrap text-foreground">
                      {cards.progressMeta}
                    </p>
                  </div>
                </div>
              </FloatingCard>

              {/* Resume */}
              <FloatingCard
                depth={150}
                delay={1.25}
                drift={10}
                className="end-[10%] bottom-[14%] lg:end-[26%]"
              >
                <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card/90 p-2 pe-5 shadow-xl shadow-stone-900/15 backdrop-blur-xl">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                    <Play size={14} className="ms-0.5 fill-current" />
                  </span>
                  <div className="whitespace-nowrap">
                    <p className="text-xs font-semibold text-foreground">
                      {cards.resumeLabel}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {cards.resumeLesson}
                    </p>
                  </div>
                  <span className="ms-1 flex h-4 items-end gap-[3px]">
                    <span className="eq-bar eq-bar-1 h-3 w-0.5 rounded-full bg-primary" />
                    <span className="eq-bar eq-bar-2 h-4 w-0.5 rounded-full bg-primary" />
                    <span className="eq-bar eq-bar-3 h-2 w-0.5 rounded-full bg-primary" />
                    <span className="eq-bar eq-bar-4 h-4 w-0.5 rounded-full bg-primary" />
                  </span>
                </div>
              </FloatingCard>

              {/* Auto-save */}
              <FloatingCard
                depth={90}
                delay={1.45}
                drift={7}
                className="end-[4%] -top-4 hidden sm:block lg:end-[27%]"
              >
                <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 py-1.5 ps-1.5 pe-4 shadow-lg shadow-stone-900/10 backdrop-blur-xl">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[10px] font-semibold whitespace-nowrap text-foreground">
                    {cards.autoSaved}
                  </span>
                </div>
              </FloatingCard>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
