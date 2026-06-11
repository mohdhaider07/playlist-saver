"use client";

import { useState } from "react";
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

  const completedCount = videos.filter(
    (v) => progressMap[v.youtubeVideoId]?.isCompleted
  ).length;
  const overallPct =
    videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sidebar Progress Tracker */}
      <div className="p-3 bg-muted/20 border-b border-white/5 space-y-2 select-none shrink-0">
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
          <span>Overall Progress</span>
          <span className="text-primary">
            {overallPct}% ({completedCount}/{videos.length})
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden border border-white/[2%]">
          <div
            className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          ></div>
        </div>
      </div>

      {/* Sidebar Live Search */}
      <div className="p-2 border-b border-white/5 shrink-0 select-none">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
          <Input
            type="text"
            placeholder="Search videos in playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 rounded-lg bg-muted/20 border-white/5 focus-visible:border-primary/50 text-xs text-foreground placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      {/* Scrollable Video List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredVideos.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-8 select-none">
            No videos match your search.
          </div>
        ) : (
          filteredVideos.map((video) => {
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

