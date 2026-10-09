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
import { PlaylistVideoItem } from "@/types";
import { motion } from "motion/react";
import { Plus, Video, Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

interface AddVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  onSuccess: (newVideo: PlaylistVideoItem) => void | Promise<void>;
}

export function AddVideoModal({
  open,
  onOpenChange,
  playlistId,
  onSuccess,
}: AddVideoModalProps) {
  const { dictionary } = useI18n();
  const t = dictionary.playlistPage;
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch(`/api/playlists/${playlistId}/videos`, {
        method: "POST",
        body: JSON.stringify({ videoUrl: trimmed }),
      });
      await onSuccess(data.video);
      setUrl("");
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl bg-card border border-border shadow-lg p-6 overflow-hidden">
        <DialogHeader className="select-none">
          <DialogTitle className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
            <Video className="size-5 text-primary" /> {t.addVideoTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 font-light">
            {t.addVideoDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <Alert variant="destructive" className="border-destructive/40 bg-destructive/10 text-destructive text-xs py-2 rounded-lg">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="video-url-input"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block"
            >
              {t.videoUrlLabel}
            </label>
            <div className="relative">
              <Input
                id="video-url-input"
                type="url"
                placeholder={t.videoUrlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                required
                className="h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="rounded-full h-10 px-5 text-xs font-semibold border-border hover:bg-secondary cursor-pointer"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              className="rounded-full h-10 px-6 text-xs font-semibold bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 cursor-pointer shadow-sm gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  {t.addingVideo}
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  {t.addVideoBtn}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
