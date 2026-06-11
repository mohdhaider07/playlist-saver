"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaylistFormatted } from "@/types";
import { Trash2, Film } from "lucide-react";

interface PlaylistCardProps {
  playlist: PlaylistFormatted;
  onDelete: (id: string) => void;
}

export function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  const completedCount = playlist.completedCount || 0;
  const progressPercent = playlist.progressPercent || 0;

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-sm shadow-black/5 border border-white/5 flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 relative">
      <Link
        href={`/playlist/${playlist.id}`}
        className="block relative aspect-video overflow-hidden"
      >
        <Image
          src={playlist.thumbnailUrl}
          alt={playlist.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={false}
        />
        <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white tracking-wide flex items-center gap-1">
          <Film className="size-3" /> {playlist.videoCount} videos
        </div>

        {/* Floating Delete Button */}
        <Button
          variant="destructive"
          size="icon-xs"
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg backdrop-blur-md bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (
              window.confirm(
                "Are you sure you want to delete this playlist?"
              )
            ) {
              onDelete(playlist.id);
            }
          }}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link
          href={`/playlist/${playlist.id}`}
          className="font-bold text-foreground line-clamp-2 hover:text-primary transition-colors text-base mb-1"
        >
          {playlist.title}
        </Link>
        <p className="text-xs font-semibold text-muted-foreground/80 mb-3 truncate">
          {playlist.channelTitle}
        </p>

        {/* Progress Bar Section */}
        <div className="my-2 space-y-1 select-none">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            <span>Watch Progress</span>
            <span className="text-primary">
              {progressPercent}% ({completedCount}/{playlist.videoCount})
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden border border-white/[2%]">
            <div
              className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-white/[4%]">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/70 tracking-wide uppercase">
            <span>
              Added {new Date(playlist.addedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

