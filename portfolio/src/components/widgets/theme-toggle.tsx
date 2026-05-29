"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("theme");

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        <div className="h-8 w-8 rounded-md" />
        <div className="h-8 w-8 rounded-md" />
        <div className="h-8 w-8 rounded-md" />
      </div>
    );
  }

  const themes = [
    { value: "light", icon: Sun, label: t("light") },
    { value: "dark", icon: Moon, label: t("dark") },
    { value: "system", icon: Monitor, label: t("system") },
  ] as const;

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
      role="radiogroup"
      aria-label={t("toggle")}
    >
      {themes.map(({ value, icon: Icon, label }) => (
        // biome-ignore lint/a11y/useSemanticElements: icon content requires button, not input[type=radio]
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
          aria-label={label}
          role="radio"
          aria-checked={theme === value}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
