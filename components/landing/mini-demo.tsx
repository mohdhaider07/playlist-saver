"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  CheckCircle2,
  ListMusic,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface MockVideo {
  id: string;
  title: string;
  duration: string;
  channel: string;
  progress: number;
  completed: boolean;
}

const INITIAL_VIDEOS: MockVideo[] = [
  {
    id: "v1",
    title: "01. Minimalism in Visual Interface Design",
    duration: "12:45",
    channel: "DesignCourse",
    progress: 0,
    completed: false,
  },
  {
    id: "v2",
    title: "02. Advanced Typography and Hierarchy Rules",
    duration: "18:20",
    channel: "DesignCourse",
    progress: 0,
    completed: false,
  },
  {
    id: "v3",
    title: "03. Mastering Layout Grids & Whitespace",
    duration: "14:10",
    channel: "DesignCourse",
    progress: 0,
    completed: false,
  },
  {
    id: "v4",
    title: "04. Micro-interactions and Animation Polish",
    duration: "11:05",
    channel: "DesignCourse",
    progress: 0,
    completed: false,
  },
];

export function MiniDemo() {
  const [step, setStep] = useState<"input" | "syncing" | "player">("input");
  const [playlistUrl, setPlaylistUrl] = useState(
    "https://www.youtube.com/playlist?list=PL_design_zen_masterclass"
  );
  const [videos, setVideos] = useState<MockVideo[]>(INITIAL_VIDEOS);
  const [activeVideoId, setActiveVideoId] = useState("v1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressVal, setProgressVal] = useState(0);

  const activeVideo = videos.find((v) => v.id === activeVideoId) || videos[0];
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync animation step
  useEffect(() => {
    if (step === "syncing") {
      const timer = setTimeout(() => {
        setStep("player");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Video progress simulation loop
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setProgressVal((prev) => {
          if (prev >= 100) {
            // Video completed!
            setIsPlaying(false);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);

            // Mark current video as completed in state
            setVideos((prevVids) =>
              prevVids.map((v) =>
                v.id === activeVideoId ? { ...v, progress: 100, completed: true } : v
              )
            );

            // Find next uncompleted video
            setTimeout(() => {
              const currentIndex = videos.findIndex((v) => v.id === activeVideoId);
              if (currentIndex < videos.length - 1) {
                const nextVid = videos[currentIndex + 1];
                setActiveVideoId(nextVid.id);
                setProgressVal(0);
                setIsPlaying(true); // Auto-advance!
              } else {
                // All videos completed!
                setIsPlaying(false);
              }
            }, 800);

            return 100;
          }
          const increment = Math.random() * 8 + 6;
          const nextVal = Math.min(prev + increment, 100);

          // Keep current video progress updated in state
          setVideos((prevVids) =>
            prevVids.map((v) =>
              v.id === activeVideoId ? { ...v, progress: Math.round(nextVal) } : v
            )
          );

          return nextVal;
        });
      }, 150);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, activeVideoId, videos]);

  const handleStartSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;
    setStep("syncing");
  };

  const handleSelectVideo = (id: string) => {
    setIsPlaying(false);
    setActiveVideoId(id);
    const selected = videos.find((v) => v.id === id);
    setProgressVal(selected ? selected.progress : 0);
  };

  const handlePlayToggle = () => {
    if (progressVal >= 100) {
      // Replay this video
      setProgressVal(0);
      setVideos((prevVids) =>
        prevVids.map((v) =>
          v.id === activeVideoId ? { ...v, progress: 0, completed: false } : v
        )
      );
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleResetDemo = () => {
    setIsPlaying(false);
    setProgressVal(0);
    setActiveVideoId("v1");
    setVideos(INITIAL_VIDEOS.map((v) => ({ ...v, progress: 0, completed: false })));
    setStep("input");
  };

  // Compute stats
  const completedCount = videos.filter((v) => v.completed).length;
  const totalVideos = videos.length;
  const overallProgress = Math.round(
    videos.reduce((acc, v) => acc + v.progress, 0) / totalVideos
  );

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel border border-border rounded-2xl overflow-hidden shadow-md bg-card">
      {/* Widget Header bar */}
      <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-secondary/30 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80 block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/80 block"></span>
            <span className="w-3 h-3 rounded-full bg-green-400/80 block"></span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-2">
            Interactive Simulator
          </span>
        </div>
        {step === "player" && (
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase bg-transparent border-none cursor-pointer"
          >
            <RefreshCw size={10} /> Reset Demo
          </button>
        )}
      </div>

      {/* Widget Contents */}
      <div className="p-6 md:p-8 min-h-[360px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* STEP 1: INPUT PLAYLIST URL */}
          {step === "input" && (
            <motion.div
              key="step-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-xl mx-auto text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20">
                <ListMusic size={22} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl font-semibold text-foreground">
                  Connect Your Playlists
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto font-light">
                  Paste any public YouTube playlist URL. Playzen compiles it into a focused list, free from distractions.
                </p>
              </div>

              <form onSubmit={handleStartSync} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  className="flex-1 h-11 px-4 text-xs bg-secondary/50 border border-border focus:border-primary/80 focus:outline-none rounded-full text-foreground/80 font-medium font-mono"
                  placeholder="https://www.youtube.com/playlist?list=..."
                />
                <button
                  type="submit"
                  className="h-11 px-6 bg-foreground text-background font-bold text-xs hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  Sync Playlist <ArrowRight size={13} />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: SYNCING ANIMATION */}
          {step === "syncing" && (
            <motion.div
              key="step-syncing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-4 py-8"
            >
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Syncing Workspace...
                </p>
                <p className="text-[11px] text-muted-foreground font-light italic">
                  Parsing Youtube metadata & setting up tracking...
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: INTERACTIVE PLAYER DASHBOARD */}
          {step === "player" && (
            <motion.div
              key="step-player"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              {/* Simulator Left Column - Video Player */}
              <div className="md:col-span-7 space-y-4">
                {/* Widescreen Video Box */}
                <div className="aspect-video bg-stone-900 rounded-xl overflow-hidden relative border border-border/80 flex items-center justify-center shadow-inner group">
                  {/* Mock Video Canvas background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-stone-800 flex items-center justify-center pointer-events-none overflow-hidden">
                    {/* Simulated Abstract Nature Grid */}
                    <div className="absolute inset-0 opacity-15">
                      <div className="w-full h-full border border-primary/20 scale-110 rotate-12 blur-xs"></div>
                      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                    </div>

                    {/* Progress Glowing Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-primary/5 pointer-events-none"
                      animate={isPlaying ? { opacity: [0.2, 0.5, 0.2] } : { opacity: 0 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  {/* Centered Controls Overlay */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <button
                      onClick={handlePlayToggle}
                      className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md cursor-pointer"
                    >
                      {isPlaying ? (
                        <div className="flex gap-1 items-center justify-center">
                          <span className="w-1 h-5 bg-white rounded-full animate-pulse"></span>
                          <span className="w-1 h-5 bg-white rounded-full animate-pulse delay-75"></span>
                        </div>
                      ) : (
                        <Play size={22} className="fill-white translate-x-0.5" />
                      )}
                    </button>
                    <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase bg-stone-950/40 px-3 py-1 rounded-full backdrop-blur-xs">
                      {isPlaying ? "Simulating Watch" : progressVal >= 100 ? "Rewatch Video" : "Click Play to Test"}
                    </span>
                  </div>

                  {/* Video Duration / Metadata Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10 select-none">
                    <span className="text-[10px] text-white/90 font-mono bg-stone-950/50 px-2 py-0.5 rounded backdrop-blur-xs">
                      {Math.floor((progressVal / 100) * 12)}m : {Math.round((progressVal % 10) * 5.9)}s / {activeVideo.duration}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-primary bg-stone-950/60 border border-primary/30 px-2.5 py-0.5 rounded uppercase">
                      Workspace mode
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="bg-secondary/40 p-4 rounded-xl border border-border/70 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-serif text-sm font-semibold text-foreground line-clamp-1">
                        {activeVideo.title}
                      </h5>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                        {activeVideo.channel}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-serif font-bold text-primary">
                        {progressVal}%
                      </span>
                    </div>
                  </div>

                  {/* Custom progress Slider track */}
                  <div className="h-1.5 w-full bg-secondary border border-border/80 rounded-full overflow-hidden relative">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-primary"
                      style={{ width: `${progressVal}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
              </div>

              {/* Simulator Right Column - Playlist sidebar */}
              <div className="md:col-span-5 space-y-4">
                {/* Statistics Box */}
                <div className="bg-secondary/20 border border-border/80 rounded-xl p-3.5 flex justify-around items-center select-none text-center">
                  <div>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                      Overall Progress
                    </p>
                    <h6 className="text-base font-serif font-semibold text-foreground mt-0.5">
                      {overallProgress}%
                    </h6>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                      Completed
                    </p>
                    <h6 className="text-base font-serif font-semibold text-foreground mt-0.5 flex items-center justify-center gap-1">
                      {completedCount} <span className="text-muted-foreground/60 text-xs font-normal">/ {totalVideos}</span>
                    </h6>
                  </div>
                </div>

                {/* Video list panel */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {videos.map((vid) => {
                    const isActive = vid.id === activeVideoId;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => handleSelectVideo(vid.id)}
                        className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isActive
                            ? "bg-card border-primary/50 shadow-sm ring-1 ring-primary/20"
                            : "bg-secondary/35 border-transparent hover:border-border hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium truncate ${
                              isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                            }`}
                          >
                            {vid.title}
                          </p>
                          <p className="text-[9px] text-muted-foreground/75 font-mono mt-0.5">
                            {vid.duration} • {vid.channel}
                          </p>
                        </div>

                        {/* Progress display */}
                        <div className="shrink-0">
                          {vid.completed ? (
                            <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-500/10" />
                          ) : vid.progress > 0 ? (
                            <div className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 rounded px-1.5">
                              {vid.progress}%
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-border"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanatory callout */}
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-[11px] text-stone-600 leading-relaxed font-light">
                  <span className="font-semibold text-primary block mb-0.5">💡 Interactive Insight</span>
                  Watch how Playzen auto-saves watch progress in the background. If you stop playing midway, it remembers the exact timestamp.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
