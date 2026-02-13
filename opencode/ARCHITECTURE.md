# Technical Architecture

## Technology Stack

### Frontend Framework
- **Next.js**: 16+ with App Router
- **React**: 19+ (latest stable)
- **TypeScript**: 5.9+, strict mode enabled
- **Build Output**: Static export (`output: 'export'`)
- **Deployment**: GitHub Pages

### UI Framework
- **ShadCN UI**: Component library (selective import)
- **Radix UI**: Unstyled primitives
- **Tailwind CSS**: 4.x, utility-first styling
- **Lucide React**: 0.563.x, Icons
- **GitHub Colors**:
  - Dark: #0d1117, #161b22, #21262d, etc.
  - Light: #ffffff, #f6f8fa, #d0d7de, etc.
- **Motion** (formerly Framer Motion): 12.x, simple animations

### Internationalization
- **next-intl**: 4.8.x (latest stable)
- **Locale Strategy**:
  ```
  1. Load English first (default)
  2. Detect browser locale (navigator.language)
  3. Fetch IP geolocation in background (async)
  4. If browser locale unavailable → use IP locale
  5. Default to English if both fail
  6. Smooth transition to detected locale
  ```
- **Translation Files**: JSON based, strongly typed
- **Supported Locales**: 
  - `en` (fallback/default)
  - `pt-BR`
- **Routing**: Dynamic `[locale]` route

### Theme System
- **next-themes**: 0.4.x, theme management
- **GitHub Themes**:
  - Dark: Authentic GitHub dark mode colors
  - Light: Authentic GitHub light mode colors
- **Default**: Auto-detect from system `prefers-color-scheme`
- **Persistence**: localStorage with key `theme`
- **Toggle**: Accessible button with Sun/Moon icons
- **CSS Variables**: Custom properties for theme colors

### Data Management
- **GitHub API**: v4 (GraphQL) or v3 (REST)
- **Pinned Repos**: Build-time + client-side fetching
- **GitHub Stats**: Build-time fetching
- **Caching Strategy**:
  ```typescript
  // Priority
  1. Display build-time cached data immediately
  2. Fetch from LocalStorage (client-side cache)
  3. Fetch live data in background (non-blocking)
  4. Update UI if data differs (stale-while-revalidate)
  5. Save new data to LocalStorage (TTL: 24h)
  ```

### External Resources
- **Gravatar**: Profile image via email hash
- **devicon**: Technology icons from CDN
- **GitHub Stats API**: external API services
- **GitHub Trophy**: external service
- **IP Geolocation API**: publicgeoip or similar (TBD)

### Development Tools
- **ESLint**: Next.js + TypeScript configuration
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Lint-staged**: Pre-commit formatting
- **Jest + React Testing Library**: Unit testing

## Project Structure

### Next.js 16+ App Router Architecture

```
src/
├── app/
│   ├── [locale]/                    # Dynamic locale routes
│   │   ├── page.tsx                 # Server Component: Main portfolio page
│   │   ├── layout.tsx               # Server Component: Locale-aware layout
│   │   └── loading.tsx              # Loading UI for this segment
│   ├── api/
│   │   └── repos/                   # Route Handler: Build-time repo cache
│   │       └── route.ts
│   ├── global-error.tsx             # Global error boundary
│   ├── layout.tsx                   # Root Server Component layout
│   └── not-found.tsx                # 404 page
├── components/
│   ├── _shared/                     # Shared components (Server & Client)
│   │   ├── avatar.tsx               # Optimized profile image
│   │   ├── icon.tsx                 # Icon wrapper with CDN fallback
│   │   └── link.tsx                 # Locale-aware NextLink wrapper
│   ├── ui/                          # ShadCN UI (selective imports)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   └── sections/                    # Section components
│       ├── about-section.tsx        # Server Component
│       ├── stats-section.tsx        # Client Component (interactive)
│       ├── repos-section.tsx        # Client Component (data fetching)
│       ├── tech-section.tsx         # Server Component
│       ├── trophy-section.tsx       # Server Component
│       └── contact-section.tsx      # Server Component
├── lib/
│   ├── server/                      # Server-only utilities
│   │   ├── github-api.ts            # Build-time GitHub data fetching
│   │   └── cache-generator.ts       # Build cache generation
│   ├── client/                      # Client-only utilities
│   │   ├── cache.ts                 # LocalStorage cache with TTL
│   │   └── geolocation.ts           # IP-based locale detection
│   ├── i18n/
│   │   ├── config.ts                # Locale configuration
│   │   └── navigation.ts            # Locale-aware navigation
│   ├── constants/                   # App constants
│   │   ├── github.ts
│   │   └── metadata.ts
│   └── utils/                       # Shared utilities
│       ├── gravatar.ts
│       └── validation.ts
├── data/
│   └── cache/                       # Build-time cache (git-ignored)
│       ├── repos.json
│       ├── stats.json
│       └── trophies.json
├── styles/
│   └── globals.css                  # Tailwind CSS with custom properties
├── messages/                        # Translation files
│   ├── en.json
│   └── pt-BR.json
└── types/                           # TypeScript type definitions
    ├── github.ts
    ├── i18n.ts
    └── index.ts
```

### Component Architecture Principles

**Server Components (default):**
- `page.tsx`, `layout.tsx`, `sections/*.tsx` - Render on server
- Fetch data at build time or per-request
- No JavaScript bundle impact

**Client Components (explicitly marked):**
- `'use client'` directive at top of file
- `stats-section.tsx` (interaction: clicking cards)
- `repos-section.tsx` (async data fetching post-load)
- `theme-toggle.tsx` (browser APIs: localStorage, matchMedia)

**Shared Components:**
- Work on both server and client
- No `'use client'` directive
- No browser-only APIs

## Key Implementations

### Component Architecture (React 19 + Next.js 16)

**Server/Client Component Boundaries:**

```typescript
// Server Component: app/[locale]/page.tsx
// Fetches data at build/request time, renders on server
import { AboutSection } from '@/components/sections/about-section';
import { getCachedData } from '@/lib/server/cache-generator';

export default async function PortfolioPage({ params }: { params: { locale: string } }) {
  // Build-time data fetching (happens during `next build`)
  const [repos, stats] = await Promise.all([
    getCachedData('repos', fetchPinnedRepos),
    getCachedData('stats', fetchGitHubStats)
  ]);

  return (
    <main>
      <AboutSection />
      <StatsSection initialStats={stats} />
      <ReposSection initialRepos={repos} />
      {/* Other sections */}
    </main>
  );
}

// Client Component: components/sections/stats-section.tsx
'use client';

import { useState, useEffect } from 'react';
import { getCachedData } from '@/lib/client/cache';

export function StatsSection({ initialStats }: { initialStats: any }) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    // Client-side refresh after initial render
    getCachedData('stats', fetchGitHubStats).then(setStats);
  }, []);

  return <StatsCard stats={stats} />;
}
```

### Locale Detection & Hydration (React 19)

**Improved Pattern with useOptimistic:**

```typescript
// lib/client/locale-detector.ts
import { useOptimistic } from 'react';

export function useLocaleDetection() {
  const [optimisticLocale, setOptimisticLocale] = useOptimistic(
    'en', // Default locale
    'locale' // Transition name
  );

  useEffect(() => {
    // Non-blocking locale detection
    const detected = await detectBrowserLocale() || await detectIPLocale();
    
    if (detected && detected !== 'en') {
      setOptimisticLocale(detected); // Smooth transition
      await switchLocale(detected);
    }
  }, []);

  return optimisticLocale;
}

// Usage in layout.tsx
export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const detectedLocale = useLocaleDetection();
  
  return (
    <html lang={detectedLocale || locale}>
      <body>{children}</body>
    </html>
  );
}
```

### Data Caching Strategy (Multi-Layer)

**Build-Time + LocalStorage + Revalidation:**

```typescript
// lib/cache/cache-manager.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: number; // For cache versioning
}

// Server-side: Build-time cache (phase 1)
export async function generateBuildCache<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const data = await fetchFn();
  await fs.writeFile(
    path.join(process.cwd(), 'data', 'cache', `${key}.json`),
    JSON.stringify({ data, timestamp: Date.now(), ttl: BUILD_CACHE_TTL })
  );
  return data;
}

// Client-side: Stale-while-revalidate (phase 2-3)
export function useCachedData<T>(key: string, fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      // 1. Load from LocalStorage (immediate)
      const cached = loadFromLocalStorage<T>(key);
      if (cached && !isExpired(cached)) {
        setData(cached.data);
      }
      
      // 2. Fetch build cache in background
      const buildCache = await fetch(`/cache/${key}.json`).then(r => r.json());
      if (buildCache && (!cached || isNewer(buildCache, cached))) {
        setData(buildCache.data);
        saveToLocalStorage(key, buildCache);
      }
      
      // 3. Fetch live data (low priority)
      setTimeout(async () => {
        try {
          const fresh = await fetchFn();
          saveToLocalStorage(key, fresh);
          // Only update if meaningful change
          if (JSON.stringify(fresh) !== JSON.stringify(data)) {
            setData(fresh);
          }
        } catch (err) {
          console.warn(`Failed to fetch fresh ${key}:`, err);
          // Fail silently - user sees cached data
        }
      }, 1000); // Delay to not block main thread
    };
    
    loadData();
  }, [key]);
  
  return data;
}
```

### Error Boundaries & Suspense (React 19)

**Global Error Handling Pattern:**

```typescript
// app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/utils/error-tracking';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="error-container">
          <h1>Something went wrong</h1>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}

// Usage with Suspense in layout.tsx
import { Suspense } from 'react';

export default function Layout({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}
```

### Build-Time Optimizations (Next.js 16 + Turbopack)

**Optimized Build Configuration:**

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  
  // Turbopack (default in Next.js 16) - 5x faster builds
  turbo: {
    enabled: true,
    memoryLimit: 4096,
  },
  
  // Optimize images for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  
  // Separate bundles per locale
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['shikiki'],
  },
  
  // Base path for GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  
  // React 19 optimizations
  reactStrictMode: true,
  
  // Generate static params for all locales at build time
  generateParams: async () => {
    return [{ locale: 'en' }, { locale: 'pt-BR' }];
  },
};

export default nextConfig;
```

### TypeScript Strict Patterns (TypeScript 5.9+)

**Type-First Architecture:**

```typescript
// types/index.ts
export type Locale = 'en' | 'pt-BR';

export interface GitHubRepo {
  name: string;
  description: string;
  stargazerCount: number;
  language: string;
  url: string;
  pushedAt: string;
}

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalRepos: number;
  followers: number;
}

export interface AppConfig {
  githubUsername: string;
  gravatarEmail: string;
  basePath: string;
}

// Type-safe env vars
export const config = {
  githubUsername: process.env.GITHUB_USERNAME!,
  gravatarEmail: process.env.GRAVATAR_EMAIL!,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
} as const satisfies AppConfig;
```

### Testing Strategy (Jest + React Testing Library)

**Component Testing Pattern:**

```typescript
// __tests__/sections/about-section.test.tsx
import { render, screen } from '@testing-library/react';
import { AboutSection } from '@/components/sections/about-section';
import { getMessages } from '@/lib/i18n';

describe('AboutSection', () => {
  it('renders with English content', async () => {
    const messages = await getMessages('en');
    render(<AboutSection messages={messages} />);
    
    expect(screen.getByRole('heading', { name: /hi, i'm srhenry/i })).toBeInTheDocument();
  });
  
  it('handles missing avatar gracefully', () => {
    const { container } = render(<AboutSection gravatarHash="invalid" />);
    expect(container.querySelector('.avatar-fallback')).toBeInTheDocument();
  });
});
```

**Integration Testing:**

```typescript
// __tests__/integration/theme-toggle.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/widgets/theme-toggle';

describe('ThemeToggle', () => {
  it('toggles theme on click', async () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    
    await userEvent.click(toggle);
    expect(localStorage.getItem('theme')).toBe('dark');
    
    await userEvent.click(toggle);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
```

### Build-Time Optimizations (Next.js 16 + Turbopack)

**Critical Features:**

```typescript
// next.config.ts
const nextConfig = {
  // Turbopack (default in Next.js 16) - 5x faster builds
  turbo: {
    enabled: true,
    memoryLimit: 4096,
  },
  
  // Optimize images for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  
  // Separate bundles per locale
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['shikiki'],
  },
  
  // React 19 optimizations
  reactStrictMode: true,
  
  // Generate static params for all locales at build time
  generateParams: async () => {
    return [{ locale: 'en' }, { locale: 'pt-BR' }];
  },
  
  // Webpack/Turbopack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          localeBundles: {
            test: /[\\/]messages[\\/]/,
            name: (module) => {
              const locale = module.context.match(/messages[\\/](en|pt-BR)/)?.[1] || 'shared';
              return `messages-${locale}`;
            },
          },
        },
      };
    }
    return config;
  },
};
```

## Performance & UX Strategy (Next.js 16 + React 19)

### 1. Critical Path Optimization

**Perceived Performance Techniques:**

```typescript
// app/[locale]/loading.tsx
export default function Loading() {
  return (
    <div className="loading-skeleton">
      <Skeleton height={200} width="100%" />
      <Skeleton height={400} width="100%" />
    </div>
  );
}

// app/[locale]/page.tsx
export default async function Page() {
  // Fetch critical data first
  const [about, stats] = await Promise.all([
    getAboutData(),
    getStatsData()
  ]);
  
  // Non-critical data streamed in parallel
  const reposPromise = getReposData();
  
  return (
    <>
      <AboutSection data={about} />
      <StatsSection data={stats} />
      <Suspense fallback={<ReposSkeleton />}>
        <ReposSection dataPromise={reposPromise} />
      </Suspense>
    </>
  );
}
```

### 2. Image Optimization Pipeline

**Multi-Strategy Approach:**

```typescript
// components/widgets/avatar.tsx
import Image from 'next/legacy/image';
import { useState } from 'react';

export function Avatar({ src, alt, fallback }: AvatarProps) {
  const [error, setError] = useState(false);
  
  if (error) {
    return <div className="avatar-fallback">{fallback}</div>;
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      quality={75}
      priority // Above-the-fold image
      placeholder="blur"
      blurDataURL="/placeholder-avatar.png"
      onError={() => setError(true)}
      loading="eager"
    />
  );
}

// For external images (GitHub, Gravatar)
export function OptimizedExternalImage({ src, ...props }) {
  return (
    <img
      src={`${src}?w=200&h=200&auto=format`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
```

### 3. Code Splitting & Bundle Optimization

**Bundle Analysis Strategy:**

```bash
# Analyze bundle size
npm run build -- --analyze

# Expected bundle sizes:
# - main.js: < 50KB (core React + Next.js runtime)
# - messages-en.js: ~5KB
# - messages-pt-BR.js: ~6KB
# - components.tsx: < 100KB (critical UI)
# - sections-about.js: ~10KB
# - sections-repos.js: ~15KB (lazy-loaded)
```

**Dynamic Imports for Non-Critical:**

```typescript
// components/widgets/github-chart.tsx
import dynamic from 'next/dynamic';

const GitHubChart = dynamic(
  () => import('@/components/widgets/github-chart').then(m => m.GitHubChart),
  {
    ssr: false, // Client-only (heavy library)
    loading: () => <Skeleton height={300} />
  }
);
```

### 4. Multi-Layer Caching Architecture

**Cache Hierarchy:**
1. **Build Cache** (.next/ or src/data/cache/) - 24h TTL
2. **HTTP Cache** (CDN) - 1h TTL  
3. **LocalStorage** (Browser) - 24h TTL
4. **Memory Cache** (React Context) - Session TTL

```typescript
// lib/cache/layered-cache.ts
class LayeredCache<T> {
  constructor(private key: string, private ttl: number) {}
  
  async get(): Promise<T | null> {
    // 1. Memory (fastest)
    if (memoryCache.has(this.key)) {
      return memoryCache.get(this.key);
    }
    
    // 2. HTTP Cache (browser)
    const httpCached = await this.fromHTTPCache();
    if (httpCached) return httpCached;
    
    // 3. LocalStorage
    const localCached = await this.fromLocalStorage();
    if (localCached) {
      memoryCache.set(this.key, localCached);
      return localCached;
    }
    
    // 4. Build cache
    const buildCached = await this.fromBuildCache();
    if (buildCached) {
      this.set(buildCached);
      return buildCached;
    }
    
    return null;
  }
}
```

### 5. UX Loading Strategy

**Progressive Enhancement:**

```typescript
// components/ui/loading.tsx
export const LoadingStates = {
  shimmer: 'shimmer',
  skeleton: 'skeleton',
  spinner: 'spinner'
} as const;

// Example: Progressive loading for GitHub cards
export function GitHubStatsCard({ statsPromise }) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Card 
      className={isHovering ? 'animate-subtle' : ''}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Suspense 
        fallback={
          <div className="animate-shimmer">
            <SkeletonText lines={2} />
          </div>
        }
      >
        <StatsContent stats={statsPromise} />
      </Suspense>
    </Card>
  );
}
```

### 6. CDN & Resource Optimization

**External Resource Strategy:**

```html
<!-- Preconnect to critical domains -->
<link rel="preconnect" href="https://api.github.com" crossorigin />
<link rel="preconnect" href="https://avatars.githubusercontent.com" crossorigin />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

<!-- Preload critical CSS -->
<link rel="preload" href="/styles/globals.css" as="style" />

<!-- Lazy load non-critical -->
<img 
  src="/hero-image.jpg" 
  loading="lazy" 
  decoding="async" 
  fetchpriority="low"
/>
```

### 7. Core Web Vitals Targets

**Performance Budget:**

| Metric | Target (Desktop) | Target (Mobile) |
|--------|------------------|-----------------|
| **FCP** | < 0.8s | < 1.5s |
| **LCP** | < 1.2s | < 2.5s |
| **FID** | < 50ms | < 100ms |
| **CLS** | < 0.05 | < 0.05 |
| **TBT** | < 100ms | < 200ms |
| **TTI** | < 2.0s | < 3.5s |

**Monitoring:**
```typescript
// lib/performance/web-vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(metric => reportToAnalytics({ name: 'cls', value: metric.value }));
onFID(metric => reportToAnalytics({ name: 'fid', value: metric.value }));
onLCP(metric => reportToAnalytics({ name: 'lcp', value: metric.value }));
```

## SEO Strategy

1. **Meta Tags**
   - Locale-specific title/description
   - Open Graph (Twitter Cards)
   - `robots.txt`: allow all
   - `sitemap.xml`: auto-generate for both locales

2. **Structured Data**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Luis Henrique da Silva Santos",
     "url": "https://srhenry.github.io",
     "sameAs": [
       "https://github.com/SrHenry",
       "https://linkedin.com/in/luis-henrique-da-silva-santos",
       "https://gitlab.com/SrHenry"
     ]
   }
   ```

## API Design

### GitHub API Integration
```typescript
interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
}

// GraphQL query for efficiency
const PINNED_REPOS_QUERY = `
  query GetPinnedRepos($username: String!) {
    user(login: $username) {
      pinnedItems(first: 3, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            stargazerCount
            primaryLanguage {
              name
              color
            }
            url
          }
        }
      }
    }
  }
`;
```

## Maintainability Best Practices (Clean Architecture)

### Principles Applied

**1. Single Responsibility:**
```typescript
// ❌ Bad: Mixed concerns
function fetchAndDisplayRepos() {
  const data = await fetchGitHub();
  setState(data); // Side effect in data function
  render(data);   // UI logic mixed
}

// ✅ Good: Separated concerns
// lib/server/github.ts - Pure data fetching
export async function fetchRepos(): Promise<Repo[]> {
  return await githubApi.repos.list();
}

// components/sections/repos-section.tsx - Pure presentation
export function ReposSection({ repos }: { repos: Repo[] }) {
  return <ul>{repos.map(renderRepo)}</ul>;
}
```

**2. Dependency Injection:**
```typescript
// lib/config.ts - Centralized dependencies
export const config = {
  github: {
    username: process.env.GITHUB_USERNAME,
    api: githubApiClient,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR']
  }
} as const;

// Makes testing and mocking easy
function getRepos(api = config.github.api) {
  return api.repos.list();
}
```

**3. Type-Driven Development:**
```typescript
// types/domain.ts - Domain models first
export interface GitHubRepo {
  readonly id: number;
  readonly name: string;
  readonly language: Language;
  readonly stars: PositiveNumber;
  readonly isPinned: boolean;
}

// Type-safe builders
function createGitHubRepo(data: unknown): GitHubRepo {
  return GitHubRepoSchema.parse(data);
}
```

**4. Feature-Based Organization:**
```
features/
├── github/
│   ├── components/
│   ├── lib/
│   └── types/
├── i18n/
│   ├── components/
│   ├── lib/
│   └── messages/
└── theme/
    ├── components/
    └── lib/
```

**5. Versioned API Abstraction:**
```typescript
// lib/github-api/v1.ts
export const githubApi = {
  async getStats(): Promise<StatsV1> {
    // Implementation
  }
};

// If API changes, create v2 without breaking v1
// lib/github-api/v2.ts
export const githubApiV2 = { /* ... */ };
```

**6. Testing Strategy:**
```typescript
// __tests__/unit - Fast unit tests
// __tests__/integration - Component integration
// __tests__/e2e - Critical user flows
// __tests__/build - Build output validation
```

## Security Considerations

1. **No Secrets in Client Code**: All tokens server-side only (build time)
2. **CORS**: External APIs must support CORS or use server-side
3. **Rate Limiting**: GitHub API token optional (increased limits)
4. **Content Security Policy** (optional): Headers for CSP

## Error Handling

1. **Translation Missing**: Fallback to English
2. **GitHub API Fail**: Use cache data gracefully
3. **Locale Detection Fail**: Default to English
4. **Theme Toggle Fail**: Graceful fallback to light
5. **Image Fail**: Gravatar fallback to initials

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari, Chrome Mobile

## Monitoring

- Lighthouse CI (optional)
- Web Vitals reporting
- Error tracking (Sentry - future)

## Build Process

```bash
npm run build
  ↓
Pre-fetch GitHub data (stats, repos, trophies)
  ↓
Store in build directory (git-ignored)
  ↓
Generate static pages for all locales
  ↓
Optimize images
  ↓
Create export bundle
  ↓
Output to `./out` directory
  ↓
Ready for deployment
```

## Deployment

1. **Build**: `npm run build && npm run export`
2. **Output**: `./out` directory
3. **Deploy**: GitHub Actions to GitHub Pages
4. **CDN**: GitHub Pages CDN
5. **Domain**: srhenry.github.io (configurable)
6. **Branch**: `gh-pages`

---

## Breaking Changes & Migration Notes (Next.js 16 + React 19)

### Major Version Bumps
- **Next.js 14 → 16**: 2 major versions (new bundler, caching, API changes)
- **React 18 → 19**: 1 major version (new hooks, Server Components stable)

### Required Updates

**1. Middleware API Changes (Next.js 16):**
```typescript
// Before (Next.js 14)
export async function middleware(req: NextRequest) {
  return NextResponse.redirect(url);
}

// After (Next.js 16)
export async function middleware(req: NextRequest) {
  const req2 = await req.clone();
  return NextResponse.redirect(url, { request: req2 });
}
```

**2. React 19 Hook Changes:**
```typescript
// useEffect cleanup is now synchronous
// useOptimistic hook replaces useTransition in some cases
// useActionState for form actions

// Before
const [isPending, startTransition] = useTransition();

// After (useOptimistic for immediate UI updates)
const [optimisticLocale, setOptimisticLocale] = useOptimistic(locale);
```

**3. TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024"],
    "types": ["react/next", "react-dom/next"]
  }
}
```

**4. Node.js Requirements:**
- **Minimum**: Node.js 20.9.0 (LTS)
- **Recommended**: Node.js 24.13.1 (LTS)
- **Reason**: Next.js 16 requires newer APIs

**5. Build Output Differences:**
- Turbopack is now default bundler (5x faster)
- Output directory structure may differ
- `.nft.json` files for deployment tracking

### Deprecated APIs
- `next export` command (use `out: 'export'` in config)
- `next build && next export` → single command
- `getStaticProps`/`getServerSideProps` (use Server Components)
- `useTransition` for data fetching (use `useOptimistic`)

**Last Updated**: February 12, 2026
**Compatibility**: Next.js 16.0.10+ App Router with Static Export, React 19.2.4+, TypeScript 5.9+
**Testing Target**: Node.js 24.13.1 LTS, npm 10.9+
**Constraints**: GitHub Pages (static only, no server-side functions)
