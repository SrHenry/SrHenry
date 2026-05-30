"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = {
  en: "EN",
  "pt-BR": "PT",
};

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("locale");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef<HTMLDivElement>(null);
  const collapsedHeightRef = useRef(0);

  const close = useCallback(() => setOpen(false), []);

  const handleToggle = useCallback(() => {
    collapsedHeightRef.current = collapsedRef.current?.offsetHeight ?? 44;
    setOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="locale-expanded"
            className="overflow-hidden rounded-2xl border border-white/20 glass-intense dark:border-white/10"
            initial={{ height: collapsedHeightRef.current, opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: collapsedHeightRef.current, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <motion.div
              className="flex flex-col gap-1 py-1 px-1.5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.03 } },
              }}
            >
              {routing.locales.map((loc) => {
                const isActive = loc === locale;
                return (
                  <motion.a
                    key={loc}
                    href={`/${loc}`}
                    onClick={close}
                    className={cn(
                      "relative rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-primary/20 border border-primary/30 dark:bg-primary/25 dark:border-primary/35" />
                    )}
                    <span className="relative z-10">{localeLabels[loc] ?? loc}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        ) : (
          <div key="locale-collapsed" ref={collapsedRef}>
            <button
              type="button"
              onClick={handleToggle}
              className="flex h-full items-center gap-1 rounded-2xl border border-white/20 glass py-2 px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground dark:border-white/10"
              aria-expanded={false}
              aria-haspopup="listbox"
              aria-label={t("switchLocale")}
            >
              {localeLabels[locale] ?? locale}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
