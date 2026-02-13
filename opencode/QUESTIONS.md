# Open Questions for Portfolio Project

## Architecture & Technical Decisions

### 1. Frontend Framework
- **Next.js** was mentioned - should I proceed with Next.js + static export for GitHub Pages?
- Or would you prefer alternatives like **Astro** (better static performance) or **SvelteKit**?
- Consideration: Next.js works perfectly with GitHub Pages via static export

### 2. Internationalization (i18n)
- **next-intl** vs **next-i18next** - any preference?
- For locale detection: browser-based (`navigator.language`) + async IP lookup?
- Which WHOIS/public IP API should I use for geolocation?
- Should translations live in JSON files or TypeScript objects?
- Default locale: en-US or en-GB?

### 3. Theme System
- **ShadCN UI** confirmed - should I install it now?
- GitHub theme colors - should I support:
  - Dark mode (default)
  - Light mode (auto-detect from system)
  - Manual toggle switch?
- Should I use **next-themes** for theme persistence?

### 4. Content Structure
- Current sections: About, Stats, Pinned Repos, Technologies, Contact Links
- **Additional sections** you'd like:
  - Projects showcase (detailed case studies)?
  - Experience/work history?
  - Skills with proficiency levels?
  - Education?
  - Blog/articles section?
  - Testimonials?
- Single-page scrolling or multi-page?

### 5. Design & UX
- Any **design inspirations** or portfolio examples you like?
- Navigation style: top nav, sidebar, or floating menu?
- Hero section - want a big headline + animated elements?
- Animations/preferences: **Framer Motion** vs minimal CSS transitions?
- Mobile-first responsive approach

### 6. Data & Features
- **Pinned repos** - fetch dynamically from GitHub API or static data?
- **GitHub stats** - keep the existing stats cards or build custom visualizations?
- **Profile image** - want to use the Kirby GIF or professional photo?
- **Download resume** button - link to existing PDFs?
- **Contact form** - or just social links?

### 7. Performance & SEO
- **Image optimization** - Next.js Image component or manual optimization?
- **Meta tags** - need Open Graph / Twitter cards?
- **Sitemap** and **robots.txt** - generate automatically?
- **Analytics** - want to add Vercel Analytics, Google Analytics, or privacy-focused alternative?

### 8. Build & Deploy
- GitHub Pages via **GitHub Actions** - should I create workflow file?
- Domain - custom domain or `srhenry.github.io`? (if custom, what's the domain?)
- CI/CD - run tests/lint on PRs?
- Build time optimization priorities?

### 9. Development Workflow
- **Linting** - ESLint + Prettier configuration?
- **TypeScript** strict mode?
- **Component organization** - by feature or by type?
- **Git hooks** - pre-commit linting/formatting?
- **Browser support** targets?

### 10. Content Updates
- How often will you update content/portfolio items?
- Should I make it easy to add new projects via markdown/data files?
- Blog integration - if desired, what platform (dev.to, Hashnode, self-hosted)?

## Your Preferences

Please answer these key questions to proceed:

1. **Framework**: Next.js static export OK?
2. **i18n**: next-intl + browser detection + IP geolocation fallback?
3. **Theme**: GitHub dark/light with auto-detect + manual toggle?
4. **Sections**: Keep it minimal (current sections) or add more?
5. **Design**: Any specific visual style or examples you like?
6. **Timeline**: When do you want this deployed?
7. **Hosting**: GitHub Pages on custom domain or default?

Once you answer these, I'll create detailed implementation plan in PROJECT.md and ARCHITECTURE.md.
