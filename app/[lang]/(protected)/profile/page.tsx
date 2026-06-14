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
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { dictionary, locale } = useI18n();
  const t = dictionary.profile;
  const to = useLocalePath();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push(to("/login"));
    } catch (error) {
      console.error(t.logoutError, error);
      setIsLoggingOut(false);
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  // Format creation date
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : dictionary.common.recentlyJoined;

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 pb-16 w-full max-w-2xl mx-auto z-10 relative">
      <div className="mb-6">
        <Link
          href={to("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>{t.backToDashboard}</span>
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
            {user?.name || dictionary.common.user}
          </h1>
          <p className="text-[10px] text-primary font-bold tracking-widest uppercase mt-1">
            {dictionary.common.learner}
          </p>
        </div>

        <div className="py-8 space-y-6">
          <div className="grid grid-cols-[auto_1fr] items-start gap-4 p-4 rounded-xl bg-secondary/35 border border-border/40">
            <User className="size-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {t.emailAddress}
              </p>
              <p className="text-sm font-medium text-foreground truncate max-w-md">
                {user?.email || t.loading}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-start gap-4 p-4 rounded-xl bg-secondary/35 border border-border/40">
            <Calendar className="size-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {t.joinedDate}
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
            {t.signOut}
          </Button>

          <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.confirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.confirmDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoggingOut}>
                  {dictionary.common.cancel}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-rose-600 hover:bg-rose-700 text-white border-none rounded-md"
                >
                  {isLoggingOut ? t.signingOut : t.signOut}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
}
