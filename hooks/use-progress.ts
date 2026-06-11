"use client";

import { apiFetch } from "@/lib/api";

export function useProgress(playlistId: string) {
  const saveProgress = async (
    youtubeVideoId: string,
    watchedSeconds: number,
    durationSeconds: number
  ) => {
    try {
      if (durationSeconds <= 0) return;
      await apiFetch("/api/progress", {
        method: "POST",
        body: JSON.stringify({
          playlistId,
          youtubeVideoId,
          watchedSeconds,
          durationSeconds,
        }),
      });
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  return { saveProgress };
}
