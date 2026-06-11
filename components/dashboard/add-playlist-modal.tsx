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
import { Link2, Sparkles } from "lucide-react";

interface AddPlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (playlist: PlaylistFormatted) => void;
}

export function AddPlaylistModal({
  open,
  onOpenChange,
  onSuccess,
}: AddPlaylistModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      onSuccess(data.playlist);
      setUrl("");
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl glass-panel border border-white/5 shadow-2xl p-6 overflow-hidden">
        <DialogHeader className="select-none">
          <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary fill-primary/10" /> Add New Playlist
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground/80 mt-1">
            Connect a public YouTube playlist to watch and save your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <Alert variant="destructive" className="rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground">
                <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              YouTube Playlist Link
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="https://www.youtube.com/playlist?list=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="pl-9 h-10 rounded-xl bg-muted/20 border-white/5 focus-visible:border-primary/50 text-foreground text-sm"
              />
            </div>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed pl-1">
              Example: <code className="text-primary font-mono font-medium">https://www.youtube.com/playlist?list=PL...</code>
            </p>
          </div>

          <DialogFooter className="pt-4 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-10 rounded-xl font-semibold hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !url}
              className="h-10 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:from-primary/95 hover:to-violet-500/95 text-white font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] px-5"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add Playlist"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

