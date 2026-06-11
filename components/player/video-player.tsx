"use client";

import { useYouTubePlayer } from "@/hooks/use-youtube-player";

interface VideoPlayerProps {
  videoId: string;
  startAt: number;
  onProgress: (seconds: number) => void;
  onEnded?: () => void;
}

export function VideoPlayer({
  videoId,
  startAt,
  onProgress,
  onEnded,
}: VideoPlayerProps) {
  const { containerId } = useYouTubePlayer(videoId, startAt, onProgress, onEnded);

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-xl border border-white/5">
      <div
        id={containerId}
        className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
      ></div>
    </div>
  );
}

