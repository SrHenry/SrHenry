# SrHenry Portfolio

Personal portfolio website built with Next.js 16, React 19, TypeScript 5.9, and Tailwind CSS 4.

## Features

- ✅ Built with Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4
- ✅ Dark/Light theme with GitHub colors
- ✅ Static export for GitHub Pages
- ✅ Server & Client Components architecture
- ✅ Build-time data caching
- ✅ Responsive design
- ✅ Optimized performance

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **React**: React 19+
- **TypeScript**: 5.9+
- **Styling**: Tailwind CSS 4.x
- **UI**: ShadCN UI components
- **Theme**: next-themes 0.4.x
- **Icons**: Lucide React 0.563.x
- **Animations**: Motion (Framer Motion) 12.x

## Project Structure

```
portfolio/
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   ├── globals.css          # Tailwind CSS entry
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   └── not-found.tsx        # 404 page
│   ├── components/              # React components
│   │   ├── _shared/             # Shared components
│   │   ├── sections/            # Section components
│   │   └── ui/                  # UI components
│   ├── lib/                     # Utilities
│   │   ├── client/              # Client-only utilities
│   │   ├── server/              # Server-only utilities
│   │   ├── constants/           # App constants
│   │   └── i18n/                # i18n configuration
│   ├── messages/                # Translation files (en, pt-BR)
│   └── types/                   # TypeScript types
├── config/                     # Root-level config files
├── data/                       # Cache and build-time data
├── styles/                     # Global styles
└── out/                        # Static export output
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
# Build static site
npm run build

# Output will be in ./out directory
```

### Generate Build Cache

To pre-fetch GitHub data during build:

```bash
# Set GitHub token for higher API limits
export GITHUB_TOKEN=your_token_here

# Or create .env.local
# GITHUB=your_token_here

# Build with cache
npm run build
```

## Deployment

### GitHub Pages

Automatically deploys on push to `main` branch via GitHub Actions.

Configuration in `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [ main ]
```

### Manual Deployment

```bash
npm run build
# Copy ./out directory to GitHub Pages
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
# Optional: GitHub API token for higher rate limits
GITHUB_TOKEN=ghp_your_token_here

# Optional: Base path for GitHub Pages
BASE_PATH=/
ASSET_PREFIX=https://srhenry.github.io
```

### GitHub Data Sources

The app fetches data from:
- GitHub user stats (public repos, followers, etc.)
- Pinned repositories (6 most recent)
- External: GitHub Trophy API
- Gravatar profile image

### i18n

Messages are statically loaded from `messages/` directory:

```typescript
// In any component:
import { messages } from '@/lib/i18n/config';
const t = messages.en.about; // or messages['pt-BR'].about
```

Messages files:
- `messages/en.json` - English translations
- `messages/pt-BR.json` - Brazilian Portuguese translations

Add translations:

```json
{
  "about": {
    "greeting": "Hi!"
  }
}
```

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

- Static export (no runtime)
- Build-time data fetching
- LocalStorage caching
- Bundle size < 100KB critical

## Key Implementation Details

### Static Export Compatibility

For static export (GitHub Pages), we use direct message imports instead of runtime i18n libraries:
- Messages are imported once from `messages/` directory
- Components load messages directly using `messages.en.sectionName`
- This eliminates next-intl runtime dependencies and config issues

### Build Cache

Create cache at build time with:
```bash
node lib/server/cache-generator.js
```

Cache stored in `data/cache/` directory.

### API Routes with Static Export

API routes in `app/api/repos/route.ts` use:
```typescript
export const dynamic = 'force-static';
```

This ensures compatibility with Next.js static export.

## Breaking Changes (Next.js 16 + React 19)

See ARCHITECTURE.md for detailed migration notes from Next.js 14/15 and React 18.

## License

MIT
