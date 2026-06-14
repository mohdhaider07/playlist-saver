"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlaylistVideoItem } from "@/types";
import { Play, Check, Film } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

interface VideoListItemProps {
  video: PlaylistVideoItem;
  isActive: boolean;
  progressPct: number;
  isCompleted: boolean;
  onClick: () => void;
}

function formatDuration(seconds: number) {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoListItem({
  video,
  isActive,
  progressPct,
  isCompleted,
  onClick,
}: VideoListItemProps) {
  const { dictionary } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailUrl = video.thumbnailUrl?.trim();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 group border-l-4 select-none border-y border-r border-y-transparent border-r-transparent",
        isActive
          ? "bg-primary/5 dark:bg-primary/10 border-primary pl-2 border-y-border/40 border-r-border/40"
          : "hover:bg-secondary/60 border-transparent pl-2"
      )}
    >
      <div 
        ref={containerRef}
        className="relative w-28 shrink-0 aspect-video rounded overflow-hidden border border-border/80 shadow-sm bg-secondary/40"
      >
        {isVisible && thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/40 text-muted-foreground">
            {isVisible ? <Film className="size-5" /> : null}
          </div>
        )}
        
        {/* Hover / Active Overlays */}
        {isActive ? (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[0.5px] flex items-center justify-center gap-[3px]">
            <span className="w-0.5 bg-primary rounded-full eq-bar eq-bar-1 h-3"></span>
            <span className="w-0.5 bg-primary rounded-full eq-bar eq-bar-2 h-4"></span>
            <span className="w-0.5 bg-primary rounded-full eq-bar eq-bar-3 h-2"></span>
            <span className="w-0.5 bg-primary rounded-full eq-bar eq-bar-4 h-5"></span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Play className="size-4 fill-white text-white translate-x-[0.5px]" />
          </div>
        )}

        <div className="absolute bottom-1 right-1 bg-stone-900/90 px-1 py-0.5 rounded text-[8px] font-bold text-stone-100 tracking-wider">
          {formatDuration(video.durationSeconds)}
        </div>

        {/* Progress bar overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary/50">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <h4
          className={cn(
            "text-xs font-semibold line-clamp-2 leading-snug tracking-tight transition-colors duration-150",
            isActive
              ? "text-primary font-bold"
              : "text-foreground/90 group-hover:text-primary"
          )}
        >
          {video.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[9px] font-bold text-muted-foreground/75 uppercase tracking-widest truncate max-w-[80px]">
            {video.channelTitle}
          </span>
          {isCompleted && (
            <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-auto shrink-0 uppercase tracking-widest">
              <Check className="size-2.5 stroke-[3]" /> {dictionary.common.done}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
