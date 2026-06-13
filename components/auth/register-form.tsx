"use client";

import React, { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "motion/react";
import { registerSchema } from "@/lib/validation";

interface RegisterFormProps {
  onSuccess: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validation = registerSchema.safeParse({ email, password, confirmPassword });
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
    setTouched({ email: true, password: true, confirmPassword: true });
    setError("");

    const validation = registerSchema.safeParse({ email, password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      onSuccess(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          Full Name
        </label>
        <Input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          Email Address
        </label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setTouched((prev) => ({ ...prev, email: true }));
          }}
          placeholder="you@example.com"
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
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          Password
        </label>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setTouched((prev) => ({ ...prev, password: true }));
          }}
          placeholder="••••••••"
          className={`h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground ${
            fieldErrors.password ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10" : ""
          }`}
        />
        {fieldErrors.password && (
          <p className="text-[10px] font-bold text-destructive pl-1">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase pl-1">
          Confirm Password
        </label>
        <Input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setTouched((prev) => ({ ...prev, confirmPassword: true }));
          }}
          placeholder="••••••••"
          className={`h-10 rounded-xl bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10 text-foreground ${
            fieldErrors.confirmPassword ? "border-destructive/60 focus-visible:border-destructive/60 focus-visible:ring-destructive/10" : ""
          }`}
        />
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
            Creating Account...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
}
