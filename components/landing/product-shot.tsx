"use client";

import React from "react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

/** Real product screenshot (per locale and theme) inside a browser frame. */
export function ProductShot({
  view,
  className,
}: {
  view: "dashboard" | "playlist";
  className?: string;
}) {
  const { dictionary, locale } = useI18n();
  const t = dictionary.home;
  const alt =
    view === "dashboard" ? t.workflowOne.dashboardAlt : t.workflowTwo.playlistAlt;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-border/70 bg-secondary/70 px-3.5">
        <span className="size-2 rounded-full bg-stone-300 dark:bg-stone-600" />
        <span className="size-2 rounded-full bg-stone-300 dark:bg-stone-600" />
        <span className="size-2 rounded-full bg-primary/70" />
        <span
          dir="ltr"
          className="mx-auto flex h-4.5 w-1/2 max-w-52 items-center justify-center rounded-full border border-border/70 bg-background/80 font-mono text-[8px] text-muted-foreground"
        >
          mytaalim.xyz/{view}
        </span>
        <span className="w-9" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${view}-${locale}-light.webp`}
        alt={alt}
        width={1600}
        height={1123}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block h-auto w-full dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${view}-${locale}-dark.webp`}
        alt={alt}
        width={1600}
        height={1123}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="hidden h-auto w-full dark:block"
      />
    </div>
  );
}
