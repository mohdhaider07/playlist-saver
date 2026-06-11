"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "motion/react";

interface OtpFormProps {
  email: string;
}

export function OtpForm({ email }: OtpFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { login } = useAuth();

  const handleResend = () => {
    console.log("OTP resend not implemented");
  };

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    if (/^[0-9]$/.test(value) || value === "") {
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-advance
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: code }),
      });
      if (data.token) {
        login(data.token, data.user);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center select-none">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Verify your email
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          We sent a verification code to <span className="font-semibold text-foreground">{email}</span>
        </p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          Dev Bypass: Use 666666
        </span>
      </div>

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

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-muted/20 border-white/5 focus-visible:border-primary/50 focus-visible:ring-primary/20"
            autoFocus={index === 0}
          />
        ))}
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:from-primary/95 hover:to-violet-500/95 text-white font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          "Verify Code"
        )}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={handleResend}
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Resend OTP
        </Button>
      </div>
    </form>
  );
}

