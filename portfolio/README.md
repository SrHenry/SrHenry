# SrHenry Portfolio

Personal portfolio website built with Next.js 16, React 19, TypeScript 5.9, and Tailwind CSS 4.

## Features

- ✅ Built with Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4
- ✅ Dynamic i18n with runtime locale switching (en/pt-BR)
- ✅ Dark/Light theme with GitHub colors
- ✅ Deployed to Vercel (full Next.js runtime)
- ✅ Server & Client Components architecture
- ✅ Real-time GitHub API integration
- ✅ Responsive design
- ✅ Optimized performance
- ✅ Preview deployments for PRs

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **React**: React 19+
- **TypeScript**: 5.9+
- **Styling**: Tailwind CSS 4.x
- **UI**: ShadCN UI components
- **i18n**: next-intl 4.8.x (plugin + runtime)
- **Theme**: next-themes 0.4.x
- **Icons**: Lucide React 0.563.x
- **Animations**: Motion (Framer Motion) 12.x
- **Deployment**: Vercel

## Project Structure

```
SrHenry/
├── .github/workflows/          # CI/CD (GitHub Actions)
├── portfolio/                 # Project root
│   ├── src/                   # Source code
│   │   ├── app/               # Next.js App Router
│   │   │   ├── [locale]/      # Locale-aware pages (dynamic)
│   │   │   │   └── page.tsx
│   │   │   ├── api/           # Runtime API routes
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── not-found.tsx
│   │   ├── components/        # React components
│   │   │   ├── _shared/
│   │   │   ├── sections/      # Section components with i18n hooks
│   │   │   └── ui/
│   │   ├── lib/              # Utilities
│   │   │   ├── client/
│   │   │   ├── constants/
│   │   │   ├── i18n/         # i18n configuration
│   │   │   └── server/
│   │   ├── messages/         # Translation files (en, pt-BR)
│   │   └── types/
│   ├── config/
│   ├── data/
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
```

## Development

### Prerequisites
- Node.js 20.9.0+ (recommend 24.13.1)
- npm 10+

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Build for Vercel
npm run build

# Output: .next/ (Vercel handles deployment)
```

### Environment Variables

Create `.env.local`:
```env
# GitHub API token for higher rate limits
GITHUB_TOKEN=ghp_your_token_here

# Optional: Custom base path (for subdirectory deployments)
# BASE_PATH=/
```

## Deployment

### Vercel (Recommended)

**Automatic deployments** on push to `main` branch via GitHub Actions.

**Configuration**:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Manual deployment**:
```bash
# Push to GitHub, Vercel auto-deploys
# Or use Vercel CLI:
npm i -g vercel
vercel
```

### GitHub Pages (Legacy)
For static export (no longer used), see git history for previous implementation.

## Configuration

### GitHub Data Sources
The app fetches data from:
- GitHub user stats (public repos, followers, etc.)
- Pinned repositories (6 most recent)
- External: GitHub Trophy API
- Gravatar profile image

### i18n (Internationalization)
The app supports multiple languages using next-intl:

**Usage in components**:
```typescript
// Server Component
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('sectionName');

// Client Component
import { useTranslations } from 'next-intl';
const t = useTranslations('sectionName');
```

**Adding translations**:
1. Add keys to `messages/en.json` and `messages/pt-BR.json`
2. Use auto-typing: messages['sectionName']['key']

**Locale files**:
- `messages/en.json` - English (default)
- `messages/pt-BR.json` - Brazilian Portuguese

## Browser Support
- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

## Performance

### Core Web Vitals Targets
- **FCP**: < 1.5s desktop, < 2.5s mobile
- **LCP**: < 2.5s
- **CLS**: < 0.05

### Optimizations
- Dynamic code splitting per locale
- ISR (Incremental Static Regeneration) for data freshness
- Optimized images via Next.js Image
- Bundle size < 100KB critical
- No blocking API calls on initial load

## Key Implementation Details

### Vercel + Next.js Full Runtime
Unlike static export, Vercel provides:
- Node.js runtime for API routes
- SSR for optimal performance
- Dynamic routing with `[locale]` segments
- Real-time data fetching
- Edge functions

### Data Caching Strategy
- ISR for GitHub data (cache with background updates)
- `getRequestConfig` in `src/i18n/request.ts`
- LocalStorage caching for client-side persistence
- Stale-while-revalidate pattern

## Breaking Changes (Next.js 16 + React 19)

See ARCHITECTURE.md for detailed migration notes.

## License
MIT
