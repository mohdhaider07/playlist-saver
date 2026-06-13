"use client";

import { useState } from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { OtpForm } from "@/components/auth/otp-form";
import { motion } from "motion/react";

export default function RegisterPage() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

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
          alt="Playzen Icon"
          className="w-14 h-14 object-contain mb-4 transition-transform duration-300 hover:scale-105"
        />
        <h2 className="text-center text-3xl font-serif font-semibold tracking-wide text-foreground">
          {registeredEmail ? "Verify your email" : "Create your account"}
        </h2>
        <div className="w-12 h-0.5 bg-primary mt-4 opacity-80"></div>
        <p className="mt-3 text-center text-sm text-muted-foreground font-light">
          {registeredEmail
            ? "Enter the verification code below"
            : "Start managing your learning playlists today"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="glass-panel py-10 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-border/80 relative">
          {!registeredEmail ? (
            <RegisterForm onSuccess={setRegisteredEmail} />
          ) : (
            <OtpForm email={registeredEmail} />
          )}

          {!registeredEmail && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

