"use client";

import { useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
  }
}

export function useYouTubePlayer(
  videoId: string,
  startAt: number,
  onProgress: (seconds: number) => void,
  onEnded?: () => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const containerId = "youtube-player-container";
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);

  // Keep refs updated
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const stopProgressInterval = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const startProgressInterval = useCallback(() => {
    stopProgressInterval();
    progressInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        onProgressRef.current(playerRef.current.getCurrentTime());
      }
    }, 5000);
  }, [stopProgressInterval]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          start: Math.floor(startAt),
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onReady: (event: any) => {
            setIsReady(true);
            if (startAt > 0) {
              event.target.seekTo(startAt, true);
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startProgressInterval();
            } else {
              stopProgressInterval();
              if (event.data === window.YT.PlayerState.ENDED && onEndedRef.current) {
                onEndedRef.current();
              }
            }
          },
        },
      });
    }

    return () => {
      stopProgressInterval();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    if (isReady && playerRef.current && playerRef.current.loadVideoById) {
      stopProgressInterval();
      playerRef.current.loadVideoById({ videoId, startSeconds: startAt });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, isReady]);

  return { isReady, containerId };
}
