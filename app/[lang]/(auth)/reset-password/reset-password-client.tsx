"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "motion/react";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";

function ResetPasswordForm() {
  const { dictionary } = useI18n();
  const t = dictionary.auth.reset;
  const to = useLocalePath();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, password, confirmPassword }),
      });
      setSuccess(data.message || t.success);
      setTimeout(() => {
        router.push(to("/login"));
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <Alert variant="destructive" className="rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground">
            <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <Alert className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
            <AlertDescription className="text-xs font-semibold">{success}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.emailAddress}
        </label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dictionary.common.emailPlaceholder}
          className="h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.otpCode}
        </label>
        <Input
          type="text"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder={dictionary.common.otpPlaceholder}
          className="h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground tracking-widest font-mono text-center text-lg"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.newPassword}
        </label>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={dictionary.common.passwordPlaceholder}
          className="h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.confirmNewPassword}
        </label>
        <Input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={dictionary.common.passwordPlaceholder}
          className="h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all mt-6 shadow-sm"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            {t.resetting}
          </span>
        ) : (
          t.resetPassword
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { dictionary } = useI18n();
  const t = dictionary.auth.reset;
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
          src="/icon-light.png"
          alt={dictionary.auth.iconAlt}
          className="w-14 h-14 object-contain mb-4 transition-transform duration-300 hover:scale-105 dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon-dark.png"
          alt={dictionary.auth.iconAlt}
          className="w-14 h-14 object-contain mb-4 transition-transform duration-300 hover:scale-105 hidden dark:block"
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
          <Suspense fallback={
            <div className="flex justify-center py-8">
              <span className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {t.backTo}{" "}
            <Link
              href={to("/login")}
              className="text-primary hover:underline font-semibold transition-colors"
            >
              {t.loginLink}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
