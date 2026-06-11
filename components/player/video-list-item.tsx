"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlaylistVideoItem } from "@/types";
import { Play, Check } from "lucide-react";

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
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group border-l-4 select-none",
        isActive
          ? "bg-primary/10 border-primary pl-1.5"
          : "hover:bg-muted/30 border-transparent pl-1.5 hover:border-muted-foreground/20"
      )}
    >
      <div className="relative w-32 shrink-0 aspect-video rounded-lg overflow-hidden border border-white/5 shadow-sm">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="128px"
        />
        
        {/* Hover / Active Overlays */}
        {isActive ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center gap-[3px]">
            <span className="w-1 bg-primary rounded-full eq-bar eq-bar-1 h-3"></span>
            <span className="w-1 bg-primary rounded-full eq-bar eq-bar-2 h-4"></span>
            <span className="w-1 bg-primary rounded-full eq-bar eq-bar-3 h-2"></span>
            <span className="w-1 bg-primary rounded-full eq-bar eq-bar-4 h-5"></span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Play className="size-5 fill-white text-white translate-x-[1px]" />
          </div>
        )}

        <div className="absolute bottom-1 right-1 bg-black/85 px-1 py-0.5 rounded text-[9px] font-bold text-white tracking-wide">
          {formatDuration(video.durationSeconds)}
        </div>

        {/* Progress bar overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <h4
          className={cn(
            "text-xs sm:text-sm font-bold line-clamp-2 leading-snug tracking-tight transition-colors duration-150",
            isActive
              ? "text-primary"
              : "text-foreground/90 group-hover:text-primary"
          )}
        >
          {video.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] font-semibold text-muted-foreground/80 truncate max-w-[90px]">
            {video.channelTitle}
          </span>
          {isCompleted && (
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ml-auto shrink-0 uppercase tracking-wide">
              <Check className="size-2.5 stroke-[3]" /> Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

