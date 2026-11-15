"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PlaylistVideoItem } from "@/types";

interface RemoveVideoDialogProps {
  video: PlaylistVideoItem | null;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  onSuccess: (videoId: string) => void | Promise<void>;
}

export function RemoveVideoDialog({
  video,
  onOpenChange,
  playlistId,
  onSuccess,
}: RemoveVideoDialogProps) {
  const { dictionary } = useI18n();
  const t = dictionary.playlistPage;
  // Keep the last video around so its title stays visible while the dialog animates out
  const [displayedVideo, setDisplayedVideo] = useState(video);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (video && video !== displayedVideo) {
    setDisplayedVideo(video);
    setError("");
  }

  const handleOpenChange = (open: boolean) => {
    if (loading) return;
    onOpenChange(open);
  };

  const handleRemove = async () => {
    if (!video) return;

    setLoading(true);
    setError("");

    try {
      await apiFetch(
        `/api/playlists/${playlistId}/videos/${encodeURIComponent(video.youtubeVideoId)}`,
        { method: "DELETE" },
      );
      await onSuccess(video.youtubeVideoId);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.removeVideoFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={video !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-card border border-border shadow-lg">
        <AlertDialogHeader className="select-none">
          <AlertDialogTitle className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
            <Trash2 className="size-4 text-destructive" /> {t.removeVideoTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground font-light">
            {t.removeVideoDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {displayedVideo && (
          <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 border-s-2 border-primary ps-3">
            {displayedVideo.title}
          </p>
        )}

        {error && (
          <Alert
            variant="destructive"
            className="border-destructive/40 bg-destructive/10 text-destructive text-xs py-2 rounded-lg"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="rounded-full h-9 px-5 text-xs font-semibold border-border hover:bg-secondary cursor-pointer"
          >
            {t.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={loading}
            className="rounded-full h-9 px-5 text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white border-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {t.removing}
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                {t.remove}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
