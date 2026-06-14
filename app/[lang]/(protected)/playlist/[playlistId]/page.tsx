"use client";

import { useEffect, useState, useRef, useCallback, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useProgress } from "@/hooks/use-progress";
import { VideoPlayer } from "@/components/player/video-player";
import { PlaylistSidebar } from "@/components/player/playlist-sidebar";
import { PlaylistVideoItem, ProgressMap } from "@/types";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";

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
  params: Promise<{ lang: string; playlistId: string }>;
}) {
  const { playlistId } = use(params);
  const { dictionary, direction } = useI18n();
  const t = dictionary.playlistPage;
  const isRtl = direction === "rtl";
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const to = useLocalePath();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoplay, setAutoplay] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "playlist">("info");
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [manualCompleteError, setManualCompleteError] = useState("");

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
          to(`/playlist/${playlistId}?v=${res.playlist.videos[0].youtubeVideoId}`),
        );
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.failedToLoad);
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
    (v) => v.youtubeVideoId === activeVideoId,
  );
  // If a video is already completed, always start from the beginning (second 0).
  // This prevents the player from resuming near the end and immediately firing
  // onEnded → auto-next when the user intentionally revisits a completed video.
  // For in-progress (not yet completed) videos we resume from where they left off.
  const startAt = (() => {
    const prog = data?.progress?.[activeVideoId || ""];
    if (!prog) return 0; // never watched — start from beginning
    if (prog.isCompleted) return 0; // completed — restart from beginning
    return prog.watchedSeconds || 0; // in-progress — resume
  })();
  const activeVideoProgress = activeVideoId
    ? data?.progress?.[activeVideoId]
    : undefined;
  const isActiveVideoCompleted = Boolean(activeVideoProgress?.isCompleted);

  const handleProgress = useCallback(
    (seconds: number) => {
      if (!activeVideoId || !activeVideo) return;
      const durationSeconds = activeVideo.durationSeconds;
      if (durationSeconds <= 0) return;

      currentProgressRef.current = {
        watched: seconds,
        duration: durationSeconds,
      };
      saveProgress(activeVideoId, seconds, durationSeconds);

      // Update local state to reflect in UI immediately
      setData((prev) => {
        if (!prev) return prev;
        const p = prev.progress[activeVideoId] || {};
        const nextWatchedSeconds = Math.max(
          p.watchedSeconds || 0,
          Math.min(Math.max(seconds, 0), durationSeconds),
        );
        const computedPercent =
          Math.round((nextWatchedSeconds / durationSeconds) * 10000) / 100;
        const percent = Math.max(p.percentComplete || 0, computedPercent);
        return {
          ...prev,
          progress: {
            ...prev.progress,
            [activeVideoId]: {
              ...p,
              watchedSeconds: nextWatchedSeconds,
              durationSeconds,
              percentComplete: percent,
              isCompleted: Boolean(p.isCompleted) || percent >= 90,
            },
          },
        };
      });
    },
    [activeVideoId, activeVideo, saveProgress],
  );

  const handleSelectVideo = (videoId: string) => {
    setManualCompleteError("");
    // Save last progress of current before switching
    if (activeVideoStr.current && currentProgressRef.current.duration > 0) {
      saveProgress(
        activeVideoStr.current,
        currentProgressRef.current.watched,
        currentProgressRef.current.duration,
      );
    }
    router.replace(to(`/playlist/${playlistId}?v=${videoId}`));
  };

  const handleMarkComplete = async () => {
    if (
      !activeVideoId ||
      !activeVideo ||
      activeVideo.durationSeconds <= 0 ||
      isActiveVideoCompleted ||
      isMarkingComplete
    ) {
      return;
    }

    setManualCompleteError("");
    setIsMarkingComplete(true);

    const saved = await saveProgress(
      activeVideoId,
      activeVideo.durationSeconds,
      activeVideo.durationSeconds,
    );

    if (!saved) {
      setManualCompleteError(t.markCompleteError);
      setIsMarkingComplete(false);
      return;
    }

    currentProgressRef.current = {
      watched: activeVideo.durationSeconds,
      duration: activeVideo.durationSeconds,
    };

    setData((prev) => {
      if (!prev) return prev;
      const p = prev.progress[activeVideoId] || {};
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [activeVideoId]: {
            ...p,
            watchedSeconds: activeVideo.durationSeconds,
            durationSeconds: activeVideo.durationSeconds,
            percentComplete: 100,
            isCompleted: true,
            lastWatchedAt: new Date(),
          },
        },
      };
    });

    setIsMarkingComplete(false);
  };

  // Video indexes for navigation
  const videos = data?.playlist?.videos || [];
  const activeIndex = videos.findIndex(
    (v) => v.youtubeVideoId === activeVideoId,
  );
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
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center pt-20 text-destructive">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 pb-16 w-full max-w-[1600px] mx-auto z-10 relative">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left/Main Column - Player */}
        <div className="w-full flex-1 flex flex-col">
          {activeVideoId ? (
            <VideoPlayer
              videoId={activeVideoId}
              startAt={startAt}
              onProgress={handleProgress}
              onEnded={handleVideoEnded}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-muted-foreground bg-card rounded-xl border border-border">
              {t.selectVideo}
            </div>
          )}

          {/* Video Controls Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-sm select-none">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={playPrev}
                disabled={!hasPrev}
                className="rounded-full h-9 px-4 gap-1 border-border text-xs font-semibold hover:bg-secondary"
              >
                <PreviousIcon className="size-3.5" />
                {t.prev}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={playNext}
                disabled={!hasNext}
                className="rounded-full h-9 px-4 gap-1 border-border text-xs font-semibold hover:bg-secondary"
              >
                {t.next}
                <NextIcon className="size-3.5" />
              </Button>
              <Button
                size="sm"
                onClick={handleMarkComplete}
                disabled={
                  !activeVideo ||
                  activeVideo.durationSeconds <= 0 ||
                  isActiveVideoCompleted ||
                  isMarkingComplete
                }
                className={`rounded-full h-9 px-4 gap-1.5 text-xs font-semibold ${
                  isActiveVideoCompleted
                    ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                    : "border-foreground bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200"
                }`}
              >
                {isMarkingComplete ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-3.5" />
                )}
                {isActiveVideoCompleted ? t.completed : t.markComplete}
              </Button>
            </div>

            {/* Autoplay toggle */}
            <div className="flex items-center gap-2">
              <label
                className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase cursor-pointer select-none"
                htmlFor="autoplay-toggle"
              >
                {t.autoplayNext}
              </label>
              <button
                type="button"
                id="autoplay-toggle"
                role="switch"
                aria-checked={autoplay}
                onClick={() => setAutoplay(!autoplay)}
                className={`relative inline-block h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  autoplay ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow ring-0 transition-[left,right] duration-200 ease-in-out ${
                    autoplay
                      ? isRtl
                        ? "left-0.5"
                        : "right-0.5"
                      : isRtl
                        ? "right-0.5"
                        : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
          {manualCompleteError && (
            <p className="mt-2 text-xs font-medium text-destructive">
              {manualCompleteError}
            </p>
          )}

          <div className="mt-6 bg-background">
            <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-wide text-foreground mb-1 leading-snug">
              {activeVideo?.title || data.playlist.title}
            </h1>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-6">
              {activeVideo?.channelTitle || data.playlist.channelTitle}
            </p>

            {/* Tabbed Info Pane */}
            <div className="flex gap-6 border-b border-border mb-5 select-none">
              <button
                onClick={() => setActiveTab("info")}
                className={`pb-3 text-[10px] font-bold tracking-widest uppercase border-b-2 px-1 transition-all ${
                  activeTab === "info"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.videoDescription}
              </button>
              <button
                onClick={() => setActiveTab("playlist")}
                className={`pb-3 text-[10px] font-bold tracking-widest uppercase border-b-2 px-1 transition-all ${
                  activeTab === "playlist"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.playlistInformation}
              </button>
            </div>

            <div className="text-sm text-foreground/80 leading-relaxed bg-card/40 p-6 rounded-xl border border-border border-l-4 border-l-primary whitespace-pre-wrap max-h-[400px] overflow-y-auto shadow-inner font-light">
              {activeTab === "info"
                ? activeVideo?.description ||
                  t.noVideoDescription
                : data.playlist.description ||
                  t.noPlaylistDescription}
            </div>
          </div>
        </div>

        {/* Right Column - Playlist Panel */}
        <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24 bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[600px] shadow-sm select-none">
          <div className="px-4 py-4 bg-card border-b border-border shrink-0 select-none">
            <h2 className="font-serif font-semibold text-foreground text-sm line-clamp-1 leading-snug">
              {data.playlist.title}
            </h2>
            <p className="text-[9px] font-bold text-muted-foreground/80 tracking-widest uppercase mt-1">
              {data.playlist.channelTitle} • {data.playlist.videos.length}{" "}
              {dictionary.common.videos}
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
