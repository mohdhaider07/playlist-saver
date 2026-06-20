"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PlaylistCard } from "@/components/dashboard/playlist-card";
import { AddPlaylistModal } from "@/components/dashboard/add-playlist-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistFormatted } from "@/types";
import { useI18n } from "@/components/i18n-provider";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Video,
  CheckCircle2,
  TrendingUp,
  Plus,
  Filter,
  Inbox,
} from "lucide-react";

export default function DashboardPage() {
  const { dictionary } = useI18n();
  const t = dictionary.dashboard;
  const [playlists, setPlaylists] = useState<PlaylistFormatted[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const searchQuery = "";
  const [channelFilter, setChannelFilter] = useState("");

  const loadPlaylists = async () => {
    try {
      const data = await apiFetch("/api/playlists", { cache: "no-store" });
      setPlaylists(data.playlists ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPlaylists();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/api/playlists/${id}`, { method: "DELETE" });
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlaylistAdded = async (newPlaylist: PlaylistFormatted) => {
    const normalizedPlaylist = {
      ...newPlaylist,
      completedCount: newPlaylist.completedCount ?? 0,
      progressPercent: newPlaylist.progressPercent ?? 0,
    };

    setChannelFilter("");
    setPlaylists((prev) => [
      normalizedPlaylist,
      ...prev.filter((playlist) => playlist.id !== normalizedPlaylist.id),
    ]);
    await loadPlaylists();
  };

  const totalPlaylists = playlists.length;
  const totalVideos = playlists.reduce((acc, p) => acc + p.videoCount, 0);
  const completedVideos = playlists.reduce((acc, p) => acc + (p.completedCount || 0), 0);
  const overallProgress =
    totalPlaylists > 0
      ? Math.round(
          playlists.reduce((acc, p) => acc + (p.progressPercent || 0), 0) /
            totalPlaylists
        )
      : 0;

  const channels = Array.from(new Set(playlists.map((p) => p.channelTitle)));
  const filteredPlaylists = playlists.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel =
      !channelFilter || p.channelTitle === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 pb-16 w-full max-w-7xl mx-auto z-10 relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-wide text-foreground flex items-center gap-3">
            {t.title}{" "}
            <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-sans font-bold uppercase tracking-widest">
              {t.badge}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-light">
            {t.description}
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="h-10 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all shadow-sm gap-1.5 self-start md:self-auto border-none px-6"
        >
          <Plus className="size-4" /> {t.addPlaylist}
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={cardVariants} className="bg-card p-5 rounded-xl flex items-center gap-4 border border-border hover:border-primary/40 transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.stats.playlists}</p>
            <h3 className="text-xl font-serif font-semibold text-foreground">{totalPlaylists}</h3>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-card p-5 rounded-xl flex items-center gap-4 border border-border hover:border-primary/40 transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Video className="size-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.stats.totalVideos}</p>
            <h3 className="text-xl font-serif font-semibold text-foreground">{totalVideos}</h3>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-card p-5 rounded-xl flex items-center gap-4 border border-border hover:border-primary/40 transition-colors">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.stats.completed}</p>
            <h3 className="text-xl font-serif font-semibold text-foreground">{completedVideos}</h3>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-card p-5 rounded-xl flex items-center gap-4 border border-border hover:border-primary/40 transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.stats.progressAvg}</p>
            <h3 className="text-xl font-serif font-semibold text-foreground">{overallProgress}%</h3>
          </div>
        </motion.div>
      </motion.div>

      {playlists.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6"
        >
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-48">
              <Filter className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full h-10 ps-8 pe-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-primary/60 cursor-pointer appearance-none"
              >
                <option value="">{t.allChannels}</option>
                {channels.map((chan) => (
                  <option key={chan} value={chan}>
                    {chan}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl bg-secondary/50" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card text-center py-20 rounded-xl border border-border relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/25">
              <Inbox className="size-8" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
              {t.emptyTitle}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed font-light">
              {t.emptyDescription}
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="h-10 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold shadow-sm gap-1.5 border-none px-6"
            >
              <Plus className="size-4" /> {t.addFirst}
            </Button>
          </div>
        </motion.div>
      ) : filteredPlaylists.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {t.noMatches}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredPlaylists.map((p) => (
              <motion.div
                key={p.id}
                variants={cardVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <PlaylistCard playlist={p} onDelete={handleDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AddPlaylistModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handlePlaylistAdded}
      />
    </div>
  );
}
