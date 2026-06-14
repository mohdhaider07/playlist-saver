"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { motion } from "motion/react";
import { LogOut, User, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  // Format creation date
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently joined";

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 pb-16 w-full max-w-2xl mx-auto z-10 relative">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl border border-border p-6 sm:p-8 relative overflow-hidden shadow-sm"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center pb-8 border-b border-border/80">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-serif font-bold shadow-md select-none border border-white/5 mb-4 transition-transform duration-300 hover:scale-105">
            {userInitial}
          </div>
          <h1 className="text-2xl font-serif font-semibold text-foreground tracking-wide">
            {user?.name || "User"}
          </h1>
          <p className="text-[10px] text-primary font-bold tracking-widest uppercase mt-1">
            Learner
          </p>
        </div>

        <div className="py-8 space-y-6">
          <div className="grid grid-cols-[auto_1fr] items-start gap-4 p-4 rounded-xl bg-secondary/35 border border-border/40">
            <User className="size-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Email Address
              </p>
              <p className="text-sm font-medium text-foreground truncate max-w-md">
                {user?.email || "Loading..."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-start gap-4 p-4 rounded-xl bg-secondary/35 border border-border/40">
            <Calendar className="size-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Joined Date
              </p>
              <p className="text-sm font-medium text-foreground">
                {joinedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <Button
            variant="destructive"
            onClick={() => setIsConfirmOpen(true)}
            className="rounded-full px-8 h-10 font-bold transition-all gap-2 bg-rose-600 hover:bg-rose-700 text-white border-none cursor-pointer"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>

          <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You will need to log in
                  again to access your saved playlists and tracking progress.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoggingOut}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-rose-600 hover:bg-rose-700 text-white border-none rounded-md"
                >
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
}
