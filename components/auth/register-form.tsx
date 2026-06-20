"use client";

import React, { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "motion/react";
import { createRegisterSchema } from "@/lib/validation";
import { useI18n } from "@/components/i18n-provider";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  onSuccess: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { dictionary } = useI18n();
  const t = dictionary.auth.registerForm;
  const registerSchema = useMemo(
    () => createRegisterSchema(dictionary.validation),
    [dictionary.validation],
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validation = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });
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
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setError("");

    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      onSuccess(email);
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
          <Alert
            variant="destructive"
            className="rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground"
          >
            <AlertDescription className="text-xs font-semibold">
              {error}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.fullName}
        </label>
        <Input
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setTouched((prev) => ({ ...prev, name: true }));
          }}
          placeholder={t.fullNamePlaceholder}
          className={`h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground ${
            fieldErrors.name
              ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10"
              : ""
          }`}
        />
        {fieldErrors.name && (
          <p className="text-[10px] font-bold text-destructive pl-1">
            {fieldErrors.name}
          </p>
        )}
      </div>

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
            fieldErrors.email
              ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10"
              : ""
          }`}
        />
        {fieldErrors.email && (
          <p className="text-[10px] font-bold text-destructive pl-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.password}
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
              fieldErrors.password
                ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10"
                : ""
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

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          {t.confirmPassword}
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setTouched((prev) => ({ ...prev, confirmPassword: true }));
            }}
            placeholder={dictionary.common.passwordPlaceholder}
            className={`h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground pr-10 w-full ${
              fieldErrors.confirmPassword
                ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10"
                : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center p-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary/20 focus:outline-hidden cursor-pointer"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-[10px] font-bold text-destructive pl-1">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-full bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200 font-bold transition-all mt-6 shadow-sm"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            {t.creatingAccount}
          </span>
        ) : (
          t.signUp
        )}
      </Button>
    </form>
  );
}
