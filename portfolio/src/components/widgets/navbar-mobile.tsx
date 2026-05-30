"use client";

import { BarChart3, Code2, GitFork, Mail, Menu, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiGithub } from "react-icons/si";
import { NavIndicator } from "@/components/widgets/navbar-indicator";
import { ThemeToggle } from "@/components/widgets/theme-toggle";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, React.ElementType> = {
  about: User,
  stats: BarChart3,
  repos: GitFork,
  tech: Code2,
  contact: Mail,
};

const sections = [
  { key: "about", href: "#about" },
  { key: "stats", href: "#stats" },
  { key: "repos", href: "#repos" },
  { key: "tech", href: "#tech" },
  { key: "contact", href: "#contact" },
] as const;

interface NavbarMobileProps {
  activeSection: string;
}

export function NavbarMobile({ activeSection }: NavbarMobileProps) {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const otherLabel = locale === "en" ? "PT" : "EN";
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barHeightRef = useRef(56);
  const closingFromNav = useRef(false);

  const handleBlur = useCallback(() => {
    requestAnimationFrame(() => {
      if (closingFromNav.current) {
        closingFromNav.current = false;
        return;
      }
      if (!navRef.current?.contains(document.activeElement)) {
        setMobileOpen(false);
      }
    });
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closingFromNav.current = true;
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    barHeightRef.current = barRef.current?.offsetHeight ?? 56;
    setMobileOpen(true);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      navRef.current?.focus();
    }
  }, [mobileOpen]);

  return (
    <nav
      ref={navRef}
      aria-label={t("menu")}
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 md:hidden"
      tabIndex={-1}
      onBlur={handleBlur}
    >
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            className="fixed inset-0 -z-10 bg-background/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {mobileOpen ? (
          <motion.div
            key="mobile-expanded"
            className="overflow-hidden rounded-2xl border border-white/20 glass-intense dark:border-white/10"
            initial={{ height: barHeightRef.current, opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: barHeightRef.current, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <motion.div
              className="flex flex-col gap-1 p-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.03 } },
              }}
            >
              {sections.map(({ key, href }) => (
                <motion.a
                  key={key}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={cn(
                    "relative rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    activeSection === key
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                  )}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  aria-current={activeSection === key ? "location" : undefined}
                >
                  {activeSection === key && <NavIndicator scope="mobile" />}
                  <span className="relative z-10">{t(key)}</span>
                </motion.a>
              ))}

              <div className="my-1 h-px bg-border" />

              <motion.div
                className="flex items-center justify-between px-3"
                variants={{
                  hidden: { opacity: 0, x: -8 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <a
                  href={`/${otherLocale}`}
                  className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {otherLabel}
                </a>
                <ThemeToggle />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div
            key="mobile-collapsed"
            ref={barRef}
            className="flex items-center justify-between rounded-2xl border border-white/20 glass px-3 py-2 dark:border-white/10"
          >
            <a href={`/${locale}`} className="flex items-center gap-1.5 font-bold text-foreground">
              <SiGithub className="h-5 w-5" />
            </a>

            <div className="flex items-center gap-1">
              {sections.slice(0, 4).map(({ key, href }) => {
                const Icon = sectionIcons[key];
                return (
                  <a
                    key={key}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={cn(
                      "relative rounded-lg px-2 py-1.5 transition-colors",
                      activeSection === key
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                    aria-current={activeSection === key ? "location" : undefined}
                  >
                    {activeSection === key && <NavIndicator scope="mobile" />}
                    <Icon className="relative z-10 h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleOpen}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label={t("menu")}
              aria-expanded={false}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
