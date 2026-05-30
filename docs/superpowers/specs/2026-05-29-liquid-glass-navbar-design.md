# Liquid Glass Navbar — Design Spec

**Date**: 2026-05-29
**Status**: Approved
**Approach**: A — `layoutId` Morphing (Motion)

## Overview

Redesign the navbar with Apple Liquid Glass aesthetics: a translucent droplet indicator that morphs between active nav items, fluid expand/collapse animations for the mobile menu, and auto-close on focus loss.

## 1. Active Indicator — The Droplet

A pill-shaped translucent element positioned behind the currently active nav item. Morphs between positions using `layoutId`.

### Visual

- Shape: `rounded-xl`
- Fill: `bg-primary/15` (light mode), `bg-primary/20` (dark mode)
- Border: `1px solid hsl(var(--primary) / 0.2)`
- Shadow: `0 0 8px hsl(var(--primary) / 0.1)`
- Size: auto-sized to match the active nav item's text width and height — handled by `layoutId` measuring the DOM element
- Transition spring: `type: "spring", stiffness: 400, damping: 30` — slightly underdamped for liquid overshoot

### Implementation

```tsx
// navbar-indicator.tsx
<motion.div
  layoutId="nav-indicator"
  className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.1)]"
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
/>
```

Each nav link is a relative container. The indicator renders as a child of the active link, positioned absolutely to fill it. When `activeSection` changes, the `layoutId` causes Motion to animate the indicator from old position to new.

## 2. Scroll Tracking

`IntersectionObserver` monitors all 5 sections (`#about`, `#stats`, `#repos`, `#tech`, `#contact`).

### Config

- `rootMargin: "-40% 0px -55% 0px"` — triggers when a section crosses the ~40-45% viewport mark
- `threshold: [0]` — only need entry/exit events

### Behavior

- On intersection change → update `activeSection` state → `layoutId` morphs droplet to new position
- On nav click → `event.preventDefault()` + `element.scrollIntoView({ behavior: "smooth" })` — observer takes over tracking after scroll completes
- On page load → `about` is active by default (top of page)

### Hook

```tsx
function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          // Pick the one with the largest intersection ratio
          const best = intersecting.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActive(best.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds]);
  return active;
}
```

## 3. Desktop Navbar

Same floating centered pill position (`fixed top-4 left-1/2 -translate-x-1/2`). Structure unchanged — brand, divider, nav links, divider, locale, theme toggle.

### Nav Link Structure

```tsx
<a href={`#${key}`} className="relative rounded-xl px-3 py-1.5 ...">
  {activeSection === key && <NavIndicator />}
  <span className="relative z-10">{t(key)}</span>
</a>
```

- Active link text: `text-foreground font-semibold` (brighter)
- Inactive link text: `text-muted-foreground font-medium` (dimmer)
- Hover: `hover:bg-foreground/5` — separate from droplet, applies to all items
- The droplet only renders for the active item

## 4. Mobile Navbar — Liquid Glass Morph

### Collapsed State (Bottom Bar)

- Floating pill at bottom: `fixed bottom-4 left-1/2 -translate-x-1/2`
- Shows: brand icon, 4 section icons (lucide icons, not text), menu button
- The active section's icon gets the droplet indicator (same `layoutId`)
- Icon mapping: about→User, stats→BarChart3, repos→GitFork, tech→Code2, contact→Mail

### Expanded State (Overlay Panel)

Morph animation via `AnimatePresence`:

```tsx
<AnimatePresence>
  {mobileOpen && (
    <motion.div
      initial={{ height: barHeight, opacity: 1 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: barHeight, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {/* Full nav links, locale, theme toggle */}
    </motion.div>
  )}
</AnimatePresence>
```

- `barHeight` is measured from the collapsed bar via `useRef`
- Menu content fades in with `staggerChildren: 0.03`
- Glass effect intensifies during expand: `backdrop-blur-xl` → `backdrop-blur-2xl`, border opacity increases from `white/20` → `white/30`
- Background overlay: semi-transparent `bg-background/40` behind the menu panel to dim content

### Focus-Lost Auto-Close

- Mobile nav wrapper: `tabIndex={-1}`, `ref={mobileNavRef}`
- `onBlur` handler on the wrapper element
- On blur → `setMobileOpen(false)` → triggers exit animation (morph back to bar)
- Guard: 150ms `requestAnimationFrame` delay before checking `document.activeElement` — avoids premature close when clicking between internal elements (e.g., from a nav link to theme toggle)

```tsx
const handleBlur = () => {
  requestAnimationFrame(() => {
    if (!mobileNavRef.current?.contains(document.activeElement)) {
      setMobileOpen(false);
    }
  });
};
```

## 5. Glass Effect Refinements

Current glass: `bg-background/60 backdrop-blur-xl border-white/20`

### Enhancements

- Specular highlight gradient: `bg-gradient-to-b from-white/5 to-transparent` overlaid on the existing `bg-background/60`
  - Light mode: `from-white/10`
  - Dark mode: `from-white/5`
- Inner top-edge highlight (Apple signature):
  - Light: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]`
  - Dark: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]`
- On mobile expand: increase blur to `backdrop-blur-2xl`, border opacity to `border-white/30`

### CSS Approach

Add a `.glass` utility class in `globals.css`:

```css
@layer utilities {
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
}
```

## 6. Component Architecture

```
components/widgets/
  navbar.tsx           → rewrite: orchestrator, scroll tracker, desktop layout
  navbar-indicator.tsx → new: pure droplet component with layoutId
  navbar-mobile.tsx    → new: mobile nav with morph expand/collapse + blur auto-close
  theme-toggle.tsx     → unchanged
```

### `navbar.tsx` (orchestrator)

- Owns `activeSection` state via `useActiveSection` hook
- Renders desktop navbar (hidden on mobile)
- Renders `<NavbarMobile>` (hidden on desktop)
- Passes `activeSection` down to both

### `navbar-indicator.tsx` (pure droplet)

```tsx
export function NavIndicator() {
  return (
    <motion.div
      layoutId="nav-indicator"
      className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/20"
      style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
```

### `navbar-mobile.tsx` (morph menu)

- Owns `mobileOpen` state
- Uses `AnimatePresence` for expand/collapse
- `onBlur` auto-close with `requestAnimationFrame` guard
- Icon mapping for collapsed bar
- Full text links for expanded panel

## 7. Deployment Impact

### GitHub Pages (static build)

- No issues — all components are client-side, no server dependencies
- `layoutId` and `AnimatePresence` work in static export

### Vercel (SSR)

- No issues — navbar is a client component (`"use client"`), renders identically

### Performance

- `layoutId` uses GPU-accelerated FLIP animations — no layout thrash
- `IntersectionObserver` is zero-cost when not intersecting
- `AnimatePresence` only mounts the expanded menu DOM when open
- Glass effects use `backdrop-filter` — hardware accelerated on all modern browsers

## 8. Accessibility

- Nav links remain `<a>` elements with `href` — keyboard navigable
- Active indicator is visual-only — screen readers use `aria-current="true"` on the active link
- Mobile menu: `aria-expanded` on toggle button, `aria-hidden` on menu when closed
- Focus-lost close: menu remains keyboard-accessible while focused, only closes on true blur

## 9. Edge Cases

- **Resize**: `layoutId` handles resize automatically — indicator re-measures
- **Fast scrolling**: IntersectionObserver throttles naturally; last intersecting section wins
- **Multiple sections visible**: The one with the largest intersection ratio should win — use `intersectionRatio` comparison
- **No sections visible** (scrolled past all): keep last active section
- **Page load with hash**: if URL has `#repos`, scroll there and set active immediately
