"use client";

import { motion } from "motion/react";

interface NavIndicatorProps {
  scope?: string;
}

export function NavIndicator({ scope = "desktop" }: NavIndicatorProps) {
  return (
    <motion.div
      layoutId={`nav-indicator-${scope}`}
      className="absolute inset-0 rounded-xl bg-primary/20 border border-primary/30 dark:bg-primary/25 dark:border-primary/35"
      style={{
        boxShadow:
          "0 0 0 1px hsl(var(--primary) / 0.15), 0 1px 3px hsl(var(--primary) / 0.12), inset 0 1px 0 hsl(var(--foreground) / 0.08)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
