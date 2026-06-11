"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { motion } from "motion/react";
import { Play } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10 flex flex-col items-center"
      >
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <Play className="size-6 fill-white text-white translate-x-[2px]" />
        </div>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back to Playlist<span className="text-primary">Hub</span>
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to continue tracking your learning progress
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="glass-panel py-10 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-white/5 relative">
          <LoginForm />

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-violet-400 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

