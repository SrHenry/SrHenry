"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const themes = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("theme");
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const firstBtn = containerRef.current.querySelector("button");
    if (firstBtn) setItemWidth(firstBtn.offsetWidth);
  }, [mounted]);

  if (!mounted) {
    return (
      <div
        className={`flex items-center rounded-2xl border border-white/20 glass py-2 px-1.5 dark:border-white/10 ${className ?? ""}`}
      >
        <div className="h-8 w-8 rounded-xl" />
        <div className="h-8 w-8 rounded-xl" />
        <div className="h-8 w-8 rounded-xl" />
      </div>
    );
  }

  const activeIndex = themes.findIndex((th) => th.value === theme);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center rounded-2xl border border-white/20 glass py-2 px-1.5 dark:border-white/10 ${className ?? ""}`}
      role="group"
      aria-label={t("toggle")}
    >
      {theme && activeIndex >= 0 && itemWidth > 0 && (
        <motion.div
          layoutId="theme-toggle-indicator"
          className="absolute top-2 bottom-2 z-0 rounded-xl bg-primary/20 border border-primary/30 dark:bg-primary/25 dark:border-primary/35"
          initial={false}
          animate={{ left: activeIndex * itemWidth + 6, width: itemWidth }}
          style={{
            boxShadow:
              "0 0 0 1px hsl(var(--primary) / 0.15), 0 1px 3px hsl(var(--primary) / 0.12), inset 0 1px 0 hsl(var(--foreground) / 0.08)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {themes.map(({ value, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-xl"
            aria-pressed={isActive}
            aria-label={t(value === "light" ? "light" : value === "dark" ? "dark" : "system")}
          >
            <Icon
              className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
