"use client";

import { useEffect, useState, useRef, useCallback, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useProgress } from "@/hooks/use-progress";
import { VideoPlayer } from "@/components/player/video-player";
import { PlaylistSidebar } from "@/components/player/playlist-sidebar";
import { PlaylistVideoItem, ProgressMap } from "@/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaylistData {
  playlist: {
    id: string;
    youtubePlaylistId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    channelTitle: string;
    videoCount: number;
    videos: PlaylistVideoItem[];
    addedAt: Date;
  };
  progress: ProgressMap;
}

export default function PlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoplay, setAutoplay] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "playlist">("info");

  const { saveProgress } = useProgress(playlistId || "");

  const activeVideoId = searchParams.get("v");
  const activeVideoStr = useRef(activeVideoId);
  const currentProgressRef = useRef<{ watched: number; duration: number }>({
    watched: 0,
    duration: 0,
  });

  useEffect(() => {
    activeVideoStr.current = activeVideoId;
  }, [activeVideoId]);

  const loadData = async () => {
    try {
      const res = await apiFetch(`/api/playlists/${playlistId}`);
      setData(res);

      // Auto-select first video if none selected
      if (!searchParams.get("v") && res.playlist.videos.length > 0) {
        router.replace(
          `/playlist/${playlistId}?v=${res.playlist.videos[0].youtubeVideoId}`
        );
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!playlistId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  const activeVideo = data?.playlist?.videos?.find(
    (v) => v.youtubeVideoId === activeVideoId
  );
  const startAt =
    data?.progress?.[activeVideoId || ""]?.watchedSeconds || 0;

  const handleProgress = useCallback(
    (seconds: number) => {
      if (!activeVideoId || !activeVideo) return;
      currentProgressRef.current = {
        watched: seconds,
        duration: activeVideo.durationSeconds,
      };
      saveProgress(activeVideoId, seconds, activeVideo.durationSeconds);

      // Update local state to reflect in UI immediately
      setData((prev) => {
        if (!prev) return prev;
        const p = prev.progress[activeVideoId] || {};
        const percent =
          Math.round(
            (seconds / activeVideo.durationSeconds) * 10000
          ) / 100;
        return {
          ...prev,
          progress: {
            ...prev.progress,
            [activeVideoId]: {
              ...p,
              watchedSeconds: seconds,
              percentComplete: percent,
              isCompleted: percent >= 90,
            },
          },
        };
      });
    },
    [activeVideoId, activeVideo, saveProgress]
  );

  const handleSelectVideo = (videoId: string) => {
    // Save last progress of current before switching
    if (
      activeVideoStr.current &&
      currentProgressRef.current.duration > 0
    ) {
      saveProgress(
        activeVideoStr.current,
        currentProgressRef.current.watched,
        currentProgressRef.current.duration
      );
    }
    router.replace(`/playlist/${playlistId}?v=${videoId}`);
  };

  // Video indexes for navigation
  const videos = data?.playlist?.videos || [];
  const activeIndex = videos.findIndex((v) => v.youtubeVideoId === activeVideoId);
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex !== -1 && activeIndex < videos.length - 1;

  const playPrev = () => {
    if (hasPrev) {
      handleSelectVideo(videos[activeIndex - 1].youtubeVideoId);
    }
  };

  const playNext = () => {
    if (hasNext) {
      handleSelectVideo(videos[activeIndex + 1].youtubeVideoId);
    }
  };

  const handleVideoEnded = () => {
    if (autoplay && hasNext) {
      playNext();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background pt-14">
        <div className="text-muted-foreground flex flex-col items-center">
          <Loader2 className="animate-spin h-8 w-8 mb-4 text-primary" />
          <p>Loading playlist workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center pt-20 text-destructive">{error}</div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col pt-14">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-56px)]">
        {/* Left/Main Column - Player */}
        <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col bg-background overflow-y-auto border-r border-white/5">
          <div className="p-4 sm:p-6 pb-0 flex-shrink-0">
            {activeVideoId ? (
              <VideoPlayer
                videoId={activeVideoId}
                startAt={startAt}
                onProgress={handleProgress}
                onEnded={handleVideoEnded}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-muted-foreground bg-card rounded-2xl border border-white/5">
                Select a video to play
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-card/40 border border-white/5 p-3 rounded-2xl backdrop-blur-md select-none">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playPrev}
                  disabled={!hasPrev}
                  className="rounded-xl h-9 px-3 gap-1 hover:bg-muted/30"
                >
                  ◀ Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playNext}
                  disabled={!hasNext}
                  className="rounded-xl h-9 px-3 gap-1 hover:bg-muted/30"
                >
                  Next ▶
                </Button>
              </div>

              {/* Autoplay toggle */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase cursor-pointer" htmlFor="autoplay-toggle">
                  Autoplay Next
                </label>
                <button
                  id="autoplay-toggle"
                  onClick={() => setAutoplay(!autoplay)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    autoplay ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-y-[1px] ${
                      autoplay ? "translate-x-[17px]" : "translate-x-[1px]"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 pt-4 bg-background flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mb-1">
              {activeVideo?.title || data.playlist.title}
            </h1>
            <p className="text-sm font-semibold text-primary/90 mb-6">
              {activeVideo?.channelTitle || data.playlist.channelTitle}
            </p>

            {/* Tabbed Info Pane */}
            <div className="flex gap-4 border-b border-white/5 mb-4 select-none">
              <button
                onClick={() => setActiveTab("info")}
                className={`pb-2.5 text-xs font-bold tracking-wider uppercase border-b-2 px-1 transition-all ${
                  activeTab === "info"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Video Description
              </button>
              <button
                onClick={() => setActiveTab("playlist")}
                className={`pb-2.5 text-xs font-bold tracking-wider uppercase border-b-2 px-1 transition-all ${
                  activeTab === "playlist"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Playlist Information
              </button>
            </div>

            <div className="text-sm text-foreground/80 leading-relaxed bg-card/30 p-5 rounded-2xl border border-white/5 whitespace-pre-wrap max-h-[400px] overflow-y-auto shadow-inner">
              {activeTab === "info"
                ? activeVideo?.description || "No description available for this video."
                : data.playlist.description || "No description available for this playlist."}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-full md:w-[30%] lg:w-[25%] flex flex-col bg-card overflow-hidden">
          <div className="px-4 py-3.5 bg-card/60 border-b border-white/5 shrink-0 select-none">
            <h2 className="font-bold text-foreground text-sm line-clamp-1">
              {data.playlist.title}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground/80 tracking-wide uppercase mt-0.5">
              {data.playlist.channelTitle} • {data.playlist.videos.length} videos
            </p>
          </div>

          <PlaylistSidebar
            videos={data.playlist.videos}
            activeVideoId={activeVideoId || ""}
            progressMap={data.progress}
            onSelectVideo={handleSelectVideo}
          />
        </div>
      </div>
    </div>
  );
}
