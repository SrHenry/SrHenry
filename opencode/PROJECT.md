# Portfolio Website Project Plan

## Project Overview
Personal portfolio landing page for SrHenry - a full-stack web developer with backend specialization since 2016.

## Core Philosophies
- **Content-first**: Load English immediately, switch locale asynchronously without blocking
- **Lean & Functional**: Minimalist design focused on functionality
- **Configurable**: Domain, features easily configurable without hardcoding
- **Performance-first**: Caching strategy, static generation, fast load times

## Requirements Summary

### Core Features
- Static portfolio website with no backend
- i18n internationalization (English + Brazilian Portuguese)
- **Load English first**, detect browser locale asynchronously, fallback to IP geolocation
- ShadCN UI with GitHub theme (dark/light, auto-detect + toggle)
- Deploy to GitHub Pages as static files only
- Based on existing README.md and README.pt-BR.md content
- Configurable base URL for future custom domain support

### Current Content from READMEs
- Professional summary (Web Developer since 2016, TypeScript specialist)
- GitHub stats cards (from external API)
- Trophy achievements (from external API)
- Pinned repositories (3 repos: storage-manager, type-utils, sdebot)
- Technology stack (10+ technologies with icons)
- Contact links (LinkedIn, GitLab)
- Profile picture (Gravatar - use gravatar.com)

### Technical Requirements
- Next.js latest stable with App Router
- TypeScript strict mode
- Build-time compilation (no runtime server)
- SEO optimized
- Performance focused
- Mobile-first responsive
- Static export for GitHub Pages

### Advanced Features

#### Caching Strategy (Pinned Repos)
1. **Build-time cache**: Pre-fetch GitHub data, store in `.next` or `src/data/cache/`
2. **LocalStorage cache**: Browser-side caching with 24h TTL
3. **Async fetch**: Fetch live data after initial render
4. **Display flow**: Build cache → Display → Async fetch → Update UI if changed
5. **Benefit**: Instant load, no API blocking, fresh data when available

#### Dynamic Pinned Repositories
- Fetch from GitHub API at build time
- Cache results in LocalStorage with expiration
- Show cached data first, update asynchronously in background
- Graceful fallback to build-time data if API unavailable

### Configurability
- Base URL configurable via environment variable or config file
- No hardcoded domain references
- Easy to switch to custom domain in future
- Use Next.js `basePath` configuration

## Tech Stack

### Core Framework
- **Next.js**: Latest stable (14+)
- **React**: Latest
- **TypeScript**: Strict mode
- **Tailwind CSS**: Utility-first CSS

### UI & Themes
- **ShadCN UI**: Component library
- **next-themes**: Theme management
- **GitHub Colors**: Authentic GitHub dark/light theme
- **Framer Motion**: Subtle animations

### Internationalization
- **next-intl**: i18n library
- **Locale Detection**: `navigator.language` → IP geolocation → English fallback
- **Content Loading**: English first, async switch to detected locale

### Data & API
- **GitHub API**: Stats, pinned repos (build-time + client-side)
- **Gravatar**: Profile picture
- **devicon**: Technology icons from CDN

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit lint/format

## Phases

### Phase 1: Architecture & Planning [COMPLETED]
- ✅ Define technical stack
- ✅ Define content structure
- ✅ Define design system
- ✅ Answer user questions
- ✅ Create decision log

### Phase 2: Project Setup & Configuration
- Initialize Next.js project
- Configure TypeScript
- Set up Tailwind CSS
- Install and configure next-intl
- Set up next-themes theme system
- Configure ShadCN UI

### Phase 3: Core Systems
- Build locale detection system (non-blocking)
- Implement theme system with GitHub colors
- Create layout system (header, footer, nav)
- Set up messaging system

### Phase 4: Component Development
- Build reusable component library
- Implement section components:
  - About section (with Gravatar)
  - GitHub stats cards (with caching)
  - Pinned repos section (dynamic + caching)
  - Technologies section (icons grid)
  - Trophy section
  - Contact links section
- Add subtle animations with Framer Motion

### Phase 5: Content & i18n
- Extract content from README.md and README.pt-BR.md
- Create translation files (en.json, pt-BR.json)
- Implement async locale switching
- Add fallback mechanisms

### Phase 6: Performance & Optimization
- Image optimization (Next.js Image)
- Enable static export
- Add loading states
- Implement caching strategies
- Optimize bundle sizes

### Phase 7: SEO & Analytics
- Meta tags per locale
- Open Graph tags
- Schema.org structured data
- Sitemap.xml generation
- robots.txt configuration

### Phase 8: Build & Deploy
- Configure static export (`next export` or `output: 'export'`)
- Create GitHub Actions deployment workflow
- Test deployment
- Configure base URL
- Deploy to GitHub Pages

### Phase 9: Testing & Polish
- Cross-browser testing
- Mobile responsiveness testing
- Performance audits (Lighthouse)
- Accessibility testing
- Fix edge cases

## Project Structure
```
src/
├── app/
│   ├── [locale]/                    # Dynamic routes for i18n
│   │   └── page.tsx                 # Main page component
│   ├── api/                         # Static API routes
│   └── layout.tsx                   # Root layout
├── components/
│   ├── ui/                          # ShadCN UI components
│   ├── layout/                      # Layout components
│   ├── sections/                    # Portfolio sections
│   └── widgets/                     # Reusable widgets
├── lib/
│   ├── i18n/                        # i18n configuration
│   ├── cache/                       # Cache utilities
│   └── constants.ts                 # App constants
├── data/
│   └── cache/                       # Build-time cache (git-ignored)
├── styles/
│   └── globals.css                  # Global styles
├── messages/                        # Translations
│   ├── en.json
│   └── pt-BR.json
├── types/                           # TypeScript types
│   └── index.ts
└── config.ts                        # App configuration
```

## Key Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- No blocking API calls on initial load
- Lighthouse score: 90+ on all metrics

## Future Enhancements (Backlog)
- Resume download button
- Blog integration
- Experience/work history timeline
- Skills with proficiency levels
- Project case studies
- Contact form
- Analytics integration

## Deliverables
- Fully functional portfolio website
- Static files deployable to GitHub Pages
- Multi-language support (EN + PT-BR)
- Theme switching (GitHub dark/light)
- Dynamic GitHub data with intelligent caching
- Source code in `src/` directory
- Deployment automation via GitHub Actions
- Performance optimized
- SEO optimized
