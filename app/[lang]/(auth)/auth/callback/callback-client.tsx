"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLocalePath } from "@/hooks/use-locale-path";
import { useI18n } from "@/components/i18n-provider";
import { motion } from "motion/react";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const to = useLocalePath();
  const { dictionary } = useI18n();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");

    if (token) {
      login(token);
      router.replace(to("/dashboard"));
    } else {
      router.replace(to("/login"));
    }
  }, [searchParams, login, router, to]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-panel p-8 rounded-2xl border border-border/80 flex flex-col items-center gap-4 max-w-sm w-full text-center"
      >
        <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-foreground">
          {dictionary.auth.loginForm.signingIn}
        </p>
      </motion.div>
    </div>
  );
}
