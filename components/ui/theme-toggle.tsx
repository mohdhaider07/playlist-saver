"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/components/i18n-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { dictionary } = useI18n();
  const t = dictionary.profile;
  const [showLightWarning, setShowLightWarning] = useState(false);

  const isDark = theme === "dark";

  const handleThemeSelect = (newTheme: "dark" | "light") => {
    if (newTheme === "light" && isDark) {
      // Show confirmation dialog before switching to light
      setShowLightWarning(true);
    } else if (newTheme === "dark" && !isDark) {
      setTheme("dark");
    }
    // If same theme selected, do nothing
  };

  const confirmSwitchToLight = () => {
    setTheme("light");
    setShowLightWarning(false);
  };

  return (
    <>
      {/* Theme Toggle Section */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {t.themeSection}
          </p>
          <p className="text-xs text-muted-foreground">{t.themeSectionDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Dark Mode Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeSelect("dark")}
            id="theme-toggle-dark"
            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left group ${
              isDark
                ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                : "border-border bg-secondary/30 hover:border-border/80 hover:bg-secondary/50"
            }`}
          >
            {/* Active indicator */}
            <AnimatePresence>
              {isDark && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-2.5 end-2.5 w-2 h-2 rounded-full bg-primary"
                />
              )}
            </AnimatePresence>

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                isDark
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              }`}
            >
              <Moon className="size-5" />
            </div>

            <div className="text-center">
              <p
                className={`text-sm font-semibold transition-colors duration-300 ${
                  isDark ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t.darkMode}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                {t.darkModeDescription}
              </p>
            </div>
          </motion.button>

          {/* Light Mode Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeSelect("light")}
            id="theme-toggle-light"
            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left group ${
              !isDark
                ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                : "border-border bg-secondary/30 hover:border-border/80 hover:bg-secondary/50"
            }`}
          >
            {/* Active indicator */}
            <AnimatePresence>
              {!isDark && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-2.5 end-2.5 w-2 h-2 rounded-full bg-primary"
                />
              )}
            </AnimatePresence>

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                !isDark
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              }`}
            >
              <Sun className="size-5" />
            </div>

            <div className="text-center">
              <p
                className={`text-sm font-semibold transition-colors duration-300 ${
                  !isDark ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t.lightMode}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                {t.lightModeDescription}
              </p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Light Mode Warning Dialog */}
      <AlertDialog open={showLightWarning} onOpenChange={setShowLightWarning}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Eye className="size-5 text-amber-500" />
              </div>
              <AlertDialogTitle className="font-serif text-lg leading-tight">
                {t.lightModeWarningTitle}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground mt-2">
              {t.lightModeWarningDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel
              onClick={() => setShowLightWarning(false)}
              className="rounded-full border-border"
            >
              {t.lightModeWarningCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSwitchToLight}
              className="rounded-full bg-amber-500 hover:bg-amber-600 text-white border-none"
            >
              {t.lightModeWarningConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
