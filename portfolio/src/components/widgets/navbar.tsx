"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import { NavIndicator } from "@/components/widgets/navbar-indicator";
import { NavbarMobile } from "@/components/widgets/navbar-mobile";
import { ThemeToggle } from "@/components/widgets/theme-toggle";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const sections = [
  { key: "about", href: "#about" },
  { key: "stats", href: "#stats" },
  { key: "repos", href: "#repos" },
  { key: "tech", href: "#tech" },
  { key: "contact", href: "#contact" },
] as const;

const sectionIds = sections.map((s) => s.href.replace("#", ""));

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const best = intersecting.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b,
          );
          setActive(best.target.id);
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      if (ids.includes(hashId)) setActive(hashId);
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Navbar() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const otherLabel = locale === "en" ? "PT" : "EN";
  const activeSection = useActiveSection(sectionIds);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Desktop: floating centered pill */}
      <div className="fixed top-4 left-1/2 z-50 hidden -translate-x-1/2 md:block">
        <nav className="flex items-center gap-1 rounded-2xl border border-white/20 glass px-2 py-2 dark:border-white/10">
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
              onClick={(e) => handleNavClick(e, href)}
              className={cn(
                "relative rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                activeSection === key
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
              aria-current={activeSection === key ? "true" : undefined}
            >
              {activeSection === key && <NavIndicator />}
              <span className="relative z-10">{t(key)}</span>
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

      {/* Mobile: delegated to NavbarMobile */}
      <NavbarMobile activeSection={activeSection} />
    </>
  );
}
