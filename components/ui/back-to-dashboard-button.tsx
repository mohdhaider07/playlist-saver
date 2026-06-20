"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { useLocalePath } from "@/hooks/use-locale-path";
import { cn } from "@/lib/utils";

interface BackToDashboardButtonProps {
  className?: string;
}

export function BackToDashboardButton({ className }: BackToDashboardButtonProps) {
  const { dictionary, direction } = useI18n();
  const to = useLocalePath();
  const isRtl = direction === "rtl";
  const Icon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={to("/dashboard")}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group select-none",
        className
      )}
    >
      <Icon
        className={cn(
          "size-4 transition-transform duration-200",
          isRtl ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"
        )}
      />
      <span>{dictionary.profile.backToDashboard}</span>
    </Link>
  );
}
