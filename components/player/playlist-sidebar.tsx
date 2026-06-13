"use client";

import { useState, useEffect } from "react";
import { PlaylistVideoItem, ProgressMap } from "@/types";
import { VideoListItem } from "./video-list-item";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlaylistSidebarProps {
  videos: PlaylistVideoItem[];
  activeVideoId: string;
  progressMap: ProgressMap;
  onSelectVideo: (videoId: string) => void;
}

export function PlaylistSidebar({
  videos,
  activeVideoId,
  progressMap,
  onSelectVideo,
}: PlaylistSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(50);

  const completedCount = videos.filter(
    (v) => progressMap[v.youtubeVideoId]?.isCompleted
  ).length;
  const overallPct =
    videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayCount(50);
  }, [searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 250) {
      setDisplayCount((prev) => Math.min(prev + 50, filteredVideos.length));
    }
  };

  const visibleVideos = filteredVideos.slice(0, displayCount);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sidebar Progress Tracker */}
      <div className="p-4 bg-secondary/40 border-b border-border space-y-2 select-none shrink-0">
        <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Overall Progress</span>
          <span className="text-primary font-serif italic font-semibold">
            {overallPct}% ({completedCount}/{videos.length})
          </span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden border border-border/20">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          ></div>
        </div>
      </div>

      {/* Sidebar Live Search */}
      <div className="p-3 border-b border-border shrink-0 select-none bg-card">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
          <Input
            type="text"
            placeholder="Search videos in playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-xs text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Scrollable Video List */}
      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 space-y-1.5"
      >
        {filteredVideos.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-8 select-none">
            No videos match your search.
          </div>
        ) : (
          visibleVideos.map((video) => {
            const prog = progressMap[video.youtubeVideoId];
            const progressPct = prog?.percentComplete || 0;
            const isCompleted = prog?.isCompleted || false;

            return (
              <VideoListItem
                key={video.youtubeVideoId}
                video={video}
                isActive={activeVideoId === video.youtubeVideoId}
                progressPct={progressPct}
                isCompleted={isCompleted}
                onClick={() => onSelectVideo(video.youtubeVideoId)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

