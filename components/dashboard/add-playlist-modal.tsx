"use client";

import React, { useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlaylistFormatted } from "@/types";
import { motion } from "motion/react";
import { Link2, Sparkles, AlertCircle } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

function isSingleVideoUrl(urlStr: string): boolean {
  try {
    const trimmed = urlStr.trim();
    if (!trimmed) return false;

    // Check if it's a valid youtube domain first
    const isYouTube = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(trimmed);
    if (!isYouTube) return false;

    // Parse URL safely
    const urlWithProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const urlObj = new URL(urlWithProtocol);

    // If it has a list parameter, it's a playlist (so it's NOT a single video)
    if (urlObj.searchParams.get("list")) {
      return false;
    }

    // It's a YouTube link without a list parameter.
    // Let's check if it's a video link (watch, shorts, embed, youtu.be, or video page)
    const isWatch = urlObj.pathname.startsWith("/watch");
    const isShorts = urlObj.pathname.startsWith("/shorts");
    const isEmbed = urlObj.pathname.startsWith("/embed");
    const isYoutuBe = urlObj.hostname.includes("youtu.be");

    if (isWatch || isShorts || isEmbed || isYoutuBe) {
      return true;
    }

    return false;
  } catch {
    // Fallback regex matching in case URL parsing fails but contains standard youtube video pattern without list
    const trimmed = urlStr.trim();
    const isYouTube = /youtube\.com|youtu\.be/i.test(trimmed);
    if (!isYouTube) return false;
    
    const hasList = /[&?]list=/i.test(trimmed);
    if (hasList) return false;

    const isVideo = /(watch\?v=|shorts\/|embed\/|\.be\/)/i.test(trimmed);
    return isVideo;
  }
}

interface AddPlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (playlist: PlaylistFormatted) => void | Promise<void>;
}

export function AddPlaylistModal({
  open,
  onOpenChange,
  onSuccess,
}: AddPlaylistModalProps) {
  const { dictionary } = useI18n();
  const t = dictionary.addPlaylist;
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSingleVideo = isSingleVideoUrl(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/playlists", {
        method: "POST",
        body: JSON.stringify({ playlistUrl: url }),
      });
      await onSuccess(data.playlist);
      setUrl("");
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-xl bg-card border border-border shadow-lg p-6 overflow-hidden">
        <DialogHeader className="select-none">
          <DialogTitle className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" /> {t.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 font-light">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 border-l-4 border-l-primary bg-secondary/30 p-4 rounded-r-xl rounded-l-sm flex flex-col gap-2 shadow-sm">
          <h4 className="text-xs font-bold text-foreground font-serif tracking-widest uppercase">
            {t.instructionsTitle}
          </h4>
          <div className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1.5 font-medium leading-relaxed">
            <p className="flex items-start gap-1.5">
              <span className="text-primary font-bold font-serif">—</span>
              <span>{t.step1}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span className="text-primary font-bold font-serif">—</span>
              <span>{t.step2}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <Alert
                variant="destructive"
                className="rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground"
              >
                <AlertDescription className="text-xs font-semibold">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              {t.label}
            </label>
            <div className="relative">
              <Link2 className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder={t.placeholder}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
                className="ps-9 h-10 rounded-xl bg-secondary/30 text-foreground text-sm border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 transition-colors"
              />
            </div>
            {isSingleVideo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-primary pl-1 flex items-center gap-1.5 mt-1">
                  <Sparkles className="size-3.5" />
                  {t.singleVideoNotice}
                </p>
              </motion.div>
            )}
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed pl-1">
              {dictionary.common.example}:{" "}
              <code className="text-primary font-mono font-semibold">
                https://www.youtube.com/playlist?list=PL...
              </code>
            </p>
          </div>

          <DialogFooter className="pt-4 mt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-10 rounded-full font-semibold hover:bg-stone-200/50 dark:hover:bg-stone-800/50 px-5"
            >
              {dictionary.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading || !url}
              className="h-10 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all px-5 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-4.5 w-4.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  {t.adding}
                </span>
              ) : (
                t.add
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
