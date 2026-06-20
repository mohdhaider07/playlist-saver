"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "motion/react";
import { createLoginSchema } from "@/lib/validation";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const { dictionary } = useI18n();
  const t = dictionary.auth.loginForm;
  const to = useLocalePath();
  const loginSchema = useMemo(
    () => createLoginSchema(dictionary.validation),
    [dictionary.validation],
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { login } = useAuth();

  const validation = loginSchema.safeParse({ email, password });
  const fieldErrors: Record<string, string> = {};
  if (!validation.success) {
    validation.error.issues.forEach((err) => {
      const path = err.path[0] as string;
      if (path && touched[path]) {
        fieldErrors[path] = err.message;
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError("");

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        login(data.token, data.user);
      }
      router.push(to("/dashboard"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.fallbackError);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ guest: true }),
      });
      if (data.token) {
        login(data.token, data.user);
      }
      router.push(to("/dashboard"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.guestFallbackError);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.emailAddress}
        </label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setTouched((prev) => ({ ...prev, email: true }));
          }}
          placeholder={dictionary.common.emailPlaceholder}
          className={`h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground ${
            fieldErrors.email ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10" : ""
          }`}
        />
        {fieldErrors.email && (
          <p className="text-[10px] font-bold text-destructive pl-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex justify-between items-center pl-1">
          <span>{t.password}</span>
          <Link
            href={to("/forgot-password")}
            className="text-primary hover:underline font-semibold transition-colors normal-case"
          >
            {t.forgotPassword}
          </Link>
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched((prev) => ({ ...prev, password: true }));
            }}
            placeholder={dictionary.common.passwordPlaceholder}
            className={`h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground pr-10 w-full ${
              fieldErrors.password ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center p-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary/20 focus:outline-hidden cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-[10px] font-bold text-destructive pl-1">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all mt-6 shadow-sm"
        disabled={loading || guestLoading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            {t.signingIn}
          </span>
        ) : (
          t.signIn
        )}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {t.or}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-10 rounded-full border-primary/30 bg-secondary/30 text-foreground hover:border-primary/60 hover:bg-primary/10 font-bold transition-all"
        disabled={loading || guestLoading}
        onClick={handleGuestLogin}
      >
        {guestLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {t.guestLoggingIn}
          </span>
        ) : (
          t.guestLogin
        )}
      </Button>
    </form>
  );
}
