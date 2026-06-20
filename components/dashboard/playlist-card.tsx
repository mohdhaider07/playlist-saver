"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlaylistFormatted } from "@/types";
import { Trash2, Film, MoreVertical } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";
import { motion, AnimatePresence } from "motion/react";

interface PlaylistCardProps {
  playlist: PlaylistFormatted;
  onDelete: (id: string) => void;
}

export function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  const { dictionary, locale } = useI18n();
  const t = dictionary.playlistCard;
  const to = useLocalePath();
  const completedCount = playlist.completedCount || 0;
  const progressPercent = playlist.progressPercent || 0;
  const thumbnailUrl = playlist.thumbnailUrl?.trim();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div
      ref={cardRef}
      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/50 flex flex-col group transition-all duration-300 relative"
    >
      <Link
        href={to(`/playlist/${playlist.id}`)}
        className="block relative aspect-video overflow-hidden"
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={playlist.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 text-muted-foreground">
            <Film className="size-8" />
          </div>
        )}
        <div className="absolute bottom-2.5 right-2.5 bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-stone-100 tracking-wider flex items-center gap-1 uppercase">
          <Film className="size-3 text-primary" /> {playlist.videoCount}{" "}
          {dictionary.common.videos}
        </div>
      </Link>

      {/* Floating 3-Dot Actions Dropdown */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-900 dark:bg-stone-950/80 dark:hover:bg-stone-950 text-stone-100 border border-white/10 transition-all shadow-md focus:outline-hidden cursor-pointer"
          aria-label="Playlist actions"
        >
          <MoreVertical className="size-4" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1.5 w-36 rounded-lg bg-card border border-border shadow-lg py-1 z-30 overflow-hidden"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen(false);
                  if (window.confirm(t.confirmDelete)) {
                    onDelete(playlist.id);
                  }
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                {t.delete}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <Link
          href={to(`/playlist/${playlist.id}`)}
          className="font-serif text-xl text-foreground line-clamp-2 hover:text-primary transition-colors mb-2 font-medium leading-snug"
        >
          {playlist.title}
        </Link>
        
        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">
          {playlist.channelTitle}
        </p>

        <div className="w-12 h-0.5 bg-primary/60 mb-4"></div>

        {/* Progress Bar Section */}
        <div className="my-2 space-y-1.5 select-none">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">
            <span>{t.watchProgress}</span>
            <span className="text-primary font-serif italic font-semibold">
              {progressPercent}% ({completedCount}/{playlist.videoCount})
            </span>
          </div>
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden border border-border/20">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-border/60">
          <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground/60 tracking-wider uppercase">
            <span>
              {t.added}{" "}
              {new Date(playlist.addedAt).toLocaleDateString(
                locale === "ar" ? "ar" : "en-US",
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
