"use client";

import { motion } from "motion/react";

interface NavIndicatorProps {
  scope?: string;
}

export function NavIndicator({ scope = "desktop" }: NavIndicatorProps) {
  return (
    <motion.div
      layoutId={`nav-indicator-${scope}`}
      className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/20 dark:bg-primary/20"
      style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
