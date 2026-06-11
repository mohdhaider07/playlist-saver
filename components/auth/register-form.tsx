"use client";

import React, { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "motion/react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Full Name
        </label>
        <Input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="h-10 rounded-xl bg-muted/20 border-white/5 focus-visible:border-primary/50 text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Email Address
        </label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-10 rounded-xl bg-muted/20 border-white/5 focus-visible:border-primary/50 text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Password
        </label>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-10 rounded-xl bg-muted/20 border-white/5 focus-visible:border-primary/50 text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Confirm Password
        </label>
        <Input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="h-10 rounded-xl bg-muted/20 border-white/5 focus-visible:border-primary/50 text-foreground"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:from-primary/95 hover:to-violet-500/95 text-white font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-6"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
}

