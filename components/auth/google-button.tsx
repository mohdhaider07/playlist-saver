"use client";

import React, { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

interface GoogleButtonProps {
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function GoogleButton({
  disabled,
  className = "",
  label,
}: GoogleButtonProps) {
  const { dictionary, locale } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    window.location.href = `/api/auth/google?lang=${locale}`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className={`w-full h-10 rounded-full border-border/80 bg-secondary/30 hover:bg-secondary/60 text-foreground font-semibold transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">
            {dictionary.auth.loginForm.googleLoggingIn}
          </span>
        </span>
      ) : (
        <>
          <svg className="size-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.685-5.17 3.685-9.09z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.98-3.1z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.98 3.1C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
          <span className="text-xs">
            {label || dictionary.auth.loginForm.continueWithGoogle}
          </span>
        </>
      )}
    </Button>
  );
}
