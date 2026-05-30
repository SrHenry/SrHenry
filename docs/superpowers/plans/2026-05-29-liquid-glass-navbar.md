# Liquid Glass Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the navbar with Apple Liquid Glass aesthetics — morphing droplet indicator, fluid mobile menu animations, focus-lost auto-close. Also set up favicons from `favicon_io.zip`.

**Architecture:** Motion's `layoutId` drives the droplet indicator (shared element that morphs between nav items). `IntersectionObserver` tracks scroll position. `AnimatePresence` handles mobile menu expand/collapse with spring physics. Focus-lost detected via `onBlur` with `requestAnimationFrame` guard. Favicons served from `public/` with metadata in root layout.

**Tech Stack:** React 19, Motion 12.x (`motion/react`), Tailwind CSS 4.x, Lucide React icons, next-intl, next-themes

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/widgets/navbar-indicator.tsx` | Create | Pure droplet component with `layoutId` |
| `src/components/widgets/navbar-mobile.tsx` | Create | Mobile nav: morph expand/collapse, blur auto-close, icon bar |
| `src/components/widgets/navbar.tsx` | Rewrite | Orchestrator: `useActiveSection` hook, desktop layout, delegates mobile |
| `src/app/globals.css` | Modify | Add `.glass` / `.glass-intense` utility classes |
| `src/messages/en.json` | Modify | Add `navigation.menu` key |
| `src/messages/pt-BR.json` | Modify | Add `navigation.menu` key |
| `public/favicon.ico` | Create | Standard favicon |
| `public/favicon-16x16.png` | Create | 16px favicon |
| `public/favicon-32x32.png` | Create | 32px favicon |
| `public/apple-touch-icon.png` | Create | Apple touch icon |
| `public/android-chrome-192x192.png` | Create | Android 192px icon |
| `public/android-chrome-512x512.png` | Create | Android 512px icon |
| `public/site.webmanifest` | Create | PWA manifest |
| `src/app/layout.tsx` | Modify | Add favicon metadata via `generateMetadata` |

---

### Task 1: Glass Utility Classes

**Files:**
- Modify: `portfolio/src/app/globals.css:62-70`

- [ ] **Step 1: Add `.glass` and `.glass-intense` utilities to `globals.css`**

  In the `@layer utilities` block, after the `.scrollbar-none` rule, add:

  ```css
  .glass {
    background: linear-gradient(to bottom, hsl(var(--foreground) / 0.03), transparent),
      hsl(var(--background) / 0.6);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.06),
      0 4px 16px rgba(0, 0, 0, 0.05);
  }

  .glass-intense {
    background: linear-gradient(to bottom, hsl(var(--foreground) / 0.05), transparent),
      hsl(var(--background) / 0.75);
    backdrop-filter: blur(48px);
    -webkit-backdrop-filter: blur(48px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
      0 8px 32px rgba(0, 0, 0, 0.08);
  }
  ```

- [ ] **Step 2: Run biome check**

  Run: `cd portfolio && npx biome check src/app/globals.css`
  Expected: PASS (CSS with `tailwindDirectives: true`)

- [ ] **Step 3: Run dev build**

  Run: `cd portfolio && npm run build 2>&1 | tail -5`
  Expected: Build succeeds, no errors

- [ ] **Step 4: Commit**

  ```bash
  git add portfolio/src/app/globals.css
  git commit -m "feat(navbar): add glass utility classes for liquid glass effect"
  ```

---

### Task 2: Navigation Translation Keys

**Files:**
- Modify: `portfolio/src/messages/en.json:6-12`
- Modify: `portfolio/src/messages/pt-BR.json` (same location)

- [ ] **Step 1: Add `menu` key to `en.json` navigation section**

  In `en.json`, inside the `"navigation"` object, add the `"menu"` key:

  ```json
  "navigation": {
    "about": "About",
    "stats": "Stats",
    "repos": "Repos",
    "tech": "Tech",
    "contact": "Contact",
    "menu": "Menu"
  }
  ```

- [ ] **Step 2: Add `menu` key to `pt-BR.json` navigation section**

  Same structure, with Portuguese translation:

  ```json
  "navigation": {
    "about": "Sobre",
    "stats": "Estatísticas",
    "repos": "Repositórios",
    "tech": "Tecnologias",
    "contact": "Contato",
    "menu": "Menu"
  }
  ```

- [ ] **Step 3: Run biome check**

  Run: `cd portfolio && npx biome check src/messages/`
  Expected: PASS

- [ ] **Step 4: Commit**

  ```bash
  git add portfolio/src/messages/en.json portfolio/src/messages/pt-BR.json
  git commit -m "feat(navbar): add menu translation key for both locales"
  ```

---

### Task 3: NavIndicator Component

**Files:**
- Create: `portfolio/src/components/widgets/navbar-indicator.tsx`

- [ ] **Step 1: Create `navbar-indicator.tsx`**

  ```tsx
  "use client";

  import { motion } from "motion/react";

  export function NavIndicator() {
    return (
      <motion.div
        layoutId="nav-indicator"
        className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/20 dark:bg-primary/20"
        style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.1)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    );
  }
  ```

- [ ] **Step 2: Run biome check**

  Run: `cd portfolio && npx biome check src/components/widgets/navbar-indicator.tsx`
  Expected: PASS

- [ ] **Step 3: Run type-check**

  Run: `cd portfolio && npx tsc --noEmit`
  Expected: PASS

- [ ] **Step 4: Commit**

  ```bash
  git add portfolio/src/components/widgets/navbar-indicator.tsx
  git commit -m "feat(navbar): add NavIndicator droplet component with layoutId"
  ```

---

### Task 4: NavbarMobile Component

**Files:**
- Create: `portfolio/src/components/widgets/navbar-mobile.tsx`

- [ ] **Step 1: Create `navbar-mobile.tsx`**

  ```tsx
  "use client";

  import { AnimatePresence, motion } from "motion/react";
  import { BarChart3, Code2, GitFork, Mail, Menu, User, X } from "lucide-react";
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

    const handleBlur = useCallback(() => {
      requestAnimationFrame(() => {
        if (!navRef.current?.contains(document.activeElement)) {
          setMobileOpen(false);
        }
      });
    }, []);

    const handleNavClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
      },
      [],
    );

    useEffect(() => {
      if (mobileOpen) {
        navRef.current?.focus();
      }
    }, [mobileOpen]);

    return (
      <div
        ref={navRef}
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
              initial={{ height: barRef.current?.offsetHeight ?? 56, opacity: 1 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: barRef.current?.offsetHeight ?? 56, opacity: 1 }}
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
                    aria-current={activeSection === key ? "true" : undefined}
                  >
                    {activeSection === key && <NavIndicator />}
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
                      aria-current={activeSection === key ? "true" : undefined}
                    >
                      {activeSection === key && <NavIndicator />}
                      <Icon className="relative z-10 h-4 w-4" />
                    </a>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                aria-label={t("menu")}
                aria-expanded={false}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  ```

- [ ] **Step 2: Run biome check**

  Run: `cd portfolio && npx biome check src/components/widgets/navbar-mobile.tsx`
  Expected: PASS (complexity under 12; if `handleNavClick` flags, inline the handler)

- [ ] **Step 3: Run type-check**

  Run: `cd portfolio && npx tsc --noEmit`
  Expected: PASS

- [ ] **Step 4: Commit**

  ```bash
  git add portfolio/src/components/widgets/navbar-mobile.tsx
  git commit -m "feat(navbar): add mobile nav with morph expand/collapse and blur auto-close"
  ```

---

### Task 5: Rewrite Navbar (Orchestrator + Desktop + useActiveSection)

**Files:**
- Rewrite: `portfolio/src/components/widgets/navbar.tsx`

- [ ] **Step 1: Rewrite `navbar.tsx`**

  ```tsx
  "use client";

  import { motion } from "motion/react";
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
        { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
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
  ```

- [ ] **Step 2: Run biome check**

  Run: `cd portfolio && npx biome check src/components/widgets/navbar.tsx`
  Expected: PASS

- [ ] **Step 3: Run type-check**

  Run: `cd portfolio && npx tsc --noEmit`
  Expected: PASS

- [ ] **Step 4: Run full build**

  Run: `cd portfolio && npm run build 2>&1 | tail -10`
  Expected: Build succeeds

- [ ] **Step 5: Commit**

  ```bash
  git add portfolio/src/components/widgets/navbar.tsx
  git commit -m "feat(navbar): rewrite with scroll tracking, droplet indicator, liquid glass"
  ```

---

### Task 6: Favicons Setup

**Files:**
- Extract from: `portfolio/favicon_io.zip`
- Create: `portfolio/public/favicon.ico`
- Create: `portfolio/public/favicon-16x16.png`
- Create: `portfolio/public/favicon-32x32.png`
- Create: `portfolio/public/apple-touch-icon.png`
- Create: `portfolio/public/android-chrome-192x192.png`
- Create: `portfolio/public/android-chrome-512x512.png`
- Create: `portfolio/public/site.webmanifest`
- Modify: `portfolio/src/app/layout.tsx`

- [ ] **Step 1: Create `public/` directory and extract favicons**

  ```bash
  mkdir -p portfolio/public
  unzip -o portfolio/favicon_io.zip -d portfolio/public/
  ```

- [ ] **Step 2: Update `site.webmanifest` with app name and theme colors**

  Replace `portfolio/public/site.webmanifest` with:

  ```json
  {
    "name": "SrHenry Portfolio",
    "short_name": "SrHenry",
    "icons": [
      { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
    ],
    "theme_color": "#1a6dd1",
    "background_color": "#ffffff",
    "display": "standalone"
  }
  ```

  Note: `theme_color` uses the primary color `hsl(212 92% 45%)` ≈ `#1a6dd1`.

- [ ] **Step 3: Add favicon metadata to root layout**

  Replace `portfolio/src/app/layout.tsx` with:

  ```tsx
  import type { Metadata } from "next";

  export const metadata: Metadata = {
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }
  ```

- [ ] **Step 4: Run biome check**

  Run: `cd portfolio && npx biome check src/app/layout.tsx`
  Expected: PASS

- [ ] **Step 5: Run type-check**

  Run: `cd portfolio && npx tsc --noEmit`
  Expected: PASS

- [ ] **Step 6: Run full build**

  Run: `cd portfolio && npm run build 2>&1 | tail -10`
  Expected: Build succeeds. Verify no 404 for favicons in build output.

- [ ] **Step 7: Commit**

  ```bash
  git add portfolio/public/ portfolio/src/app/layout.tsx
  git commit -m "feat: add favicons from favicon_io.zip with metadata in root layout"
  ```

---

### Task 7: Visual Verification & Polish

**Files:**
- Potentially modify: `portfolio/src/components/widgets/navbar-indicator.tsx`
- Potentially modify: `portfolio/src/components/widgets/navbar.tsx`
- Potentially modify: `portfolio/src/components/widgets/navbar-mobile.tsx`
- Potentially modify: `portfolio/src/app/globals.css`

- [ ] **Step 1: Start dev server and verify desktop**

  Run: `cd portfolio && npm run dev`

  Open `http://localhost:3000/en` in a browser. Verify:
  - Droplet indicator appears behind "About" on load
  - Scroll down — droplet morphs fluidly to next section
  - Click a nav link — smooth scroll + droplet follows
  - Glass effect: subtle specular highlight, top-edge glow, translucent background
  - Active text is bright (foreground), inactive is muted
  - Favicon visible in browser tab

- [ ] **Step 2: Verify mobile**

  Resize to mobile width (< 768px). Verify:
  - Bottom bar shows icons (User, BarChart3, GitFork, Code2) + menu button
  - Active icon has droplet indicator
  - Tap menu button — bar morphs into expanded panel with spring animation
  - Nav items stagger in from left
  - Tap outside menu — morphs back to collapsed bar
  - Glass intensifies on expand (deeper blur, stronger border)
  - Background overlay dims content behind menu

- [ ] **Step 3: Verify cross-browser (if possible)**

  Test in Firefox and Chrome. Verify `backdrop-filter` works in both.

- [ ] **Step 4: Fix any issues found**

  Adjust spring params, colors, spacing as needed. Rerun biome + type-check.

- [ ] **Step 5: Final build check**

  Run: `cd portfolio && npm run build 2>&1 | tail -10`
  Expected: Build succeeds

- [ ] **Step 6: Commit any polish changes**

  ```bash
  git add -u
  git commit -m "fix(navbar): polish liquid glass animations and visual refinements"
  ```

---

## Self-Review

**1. Spec coverage:**
- Section 1 (Droplet) → Task 3 (NavIndicator) ✓
- Section 2 (Scroll tracking) → Task 5 (useActiveSection) ✓
- Section 3 (Desktop navbar) → Task 5 (Navbar desktop) ✓
- Section 4 (Mobile morph) → Task 4 (NavbarMobile) ✓
- Section 5 (Glass CSS) → Task 1 (globals.css) ✓
- Section 6 (Component architecture) → Tasks 3-5 ✓
- Section 8 (Accessibility) → `aria-current`, `aria-expanded`, `aria-label` ✓
- Section 9 (Edge cases) → `intersectionRatio` comparison, hash detection on load ✓
- Favicons (user request) → Task 6 (extract + layout metadata) ✓

**2. Placeholder scan:** No TBDs, no TODOs, all steps have complete code.

**3. Type consistency:**
- `NavIndicator()` used in both `navbar.tsx` and `navbar-mobile.tsx` — same signature (no props) ✓
- `NavbarMobile` accepts `{ activeSection: string }` — passed from `Navbar` ✓
- `sectionIds` is `string[]` — matches `useActiveSection` parameter ✓
- `handleNavClick` signature consistent between desktop and mobile ✓
- Root layout exports `Metadata` type — matches Next.js App Router convention ✓
- `site.webmanifest` paths are absolute (`/android-chrome-...`) — correct for `public/` serving ✓
