"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { motion } from "motion/react";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";

export default function LoginPage() {
  const { dictionary } = useI18n();
  const t = dictionary.auth.login;
  const to = useLocalePath();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-stone-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10 flex flex-col items-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon.png"
          alt={dictionary.auth.iconAlt}
          className="w-14 h-14 object-contain mb-4 transition-transform duration-300 hover:scale-105"
        />
        <h2 className="text-center text-3xl font-serif font-semibold tracking-wide text-foreground">
          {t.title}
        </h2>
        <div className="w-12 h-0.5 bg-primary mt-4 opacity-80"></div>
        <p className="mt-3 text-center text-sm text-muted-foreground font-light">
          {t.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="glass-panel py-10 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-border/80 relative">
          <LoginForm />

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {t.noAccount}{" "}
            <Link
              href={to("/register")}
              className="text-primary hover:underline font-semibold transition-colors"
            >
              {t.signUpLink}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
