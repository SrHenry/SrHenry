"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { ThemeToggle } from "@/components/widgets/theme-toggle";
import { routing } from "@/i18n/routing";

const sections = [
  { key: "about", href: "#about" },
  { key: "stats", href: "#stats" },
  { key: "repos", href: "#repos" },
  { key: "tech", href: "#tech" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const otherLabel = locale === "en" ? "PT" : "EN";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: floating centered pill */}
      <div className="fixed top-4 left-1/2 z-50 hidden -translate-x-1/2 md:block">
        <nav className="flex items-center gap-1 rounded-2xl border border-white/20 bg-background/60 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:shadow-black/20">
          <a
            href={`/${locale}`}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 font-bold text-foreground transition-colors hover:bg-foreground/5"
          >
            <SiGithub className="h-5 w-5" />
            SrHenry
          </a>

          <div className="mx-1 h-5 w-px bg-border" />

          {sections.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {t(key)}
            </a>
          ))}

          <div className="mx-1 h-5 w-px bg-border" />

          <a
            href={`/${otherLocale}`}
            className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            {otherLabel}
          </a>

          <ThemeToggle />
        </nav>
      </div>

      {/* Mobile: bottom floating pill bar */}
      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 md:hidden">
        <nav className="flex items-center justify-between rounded-2xl border border-white/20 bg-background/60 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:shadow-black/20">
          <a href={`/${locale}`} className="flex items-center gap-1.5 font-bold text-foreground">
            <SiGithub className="h-5 w-5" />
          </a>

          <div className="flex items-center gap-1">
            {sections.slice(0, 4).map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {t(key)}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile expanded menu */}
        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-white/20 bg-background/60 p-3 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:shadow-black/20">
            <div className="flex flex-col gap-1">
              {sections.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {t(key)}
                </a>
              ))}
              <div className="my-1 h-px bg-border" />
              <div className="flex items-center justify-between px-3">
                <a
                  href={`/${otherLocale}`}
                  className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {otherLabel}
                </a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
