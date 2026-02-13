import fs from 'node:fs/promises';
import path from 'node:path';
import { GITHUB_USERNAME } from '../constants';

if (!process.env.GITHUB_TOKEN) {
  console.warn('Warning: GITHUB_TOKEN not set. Build cache will use public API limits.');
}

const GITHUB_API_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
  'User-Agent': 'portfolio-srhenry',
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

async function fetchWithCache<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: GITHUB_API_HEADERS });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function generateBuildCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  try {
    const data = await fetchFn();
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: 2 * 60 * 60 * 1000, // 24 hours
    };
    
    const cacheDir = path.join(process.cwd(), 'data', 'cache');
    await fs.mkdir(cacheDir, { recursive: true });
    
    await fs.writeFile(
      path.join(cacheDir, `${key}.json`),
      JSON.stringify(cacheEntry, null, 2)
    );
    
    console.log(`✓ Build cache generated: ${key}`);
    return data;
  } catch (error) {
    console.warn(`✗ Failed to generate build cache for ${key}:`, error);
    // Return empty data gracefully
    return [] as unknown as T;
  }
}

export async function generateAllCache() {
  console.log('Generating build cache...');
  
  await Promise.all([
    generateBuildCache('repos', async () => {
      // Fetch pinned repos from GitHub API
      const response = await fetchWithCache(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
      );
      return (response as any[]).map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'No description',
        stargazers_count: repo.stargazers_count,
        language: repo.language || 'Unknown',
        html_url: repo.html_url,
        pushed_at: repo.pushed_at,
        size: repo.size,
      }));
    }),
    
    generateBuildCache('stats', async () => {
      const response = await fetchWithCache(
        `https://api.github.com/users/${GITHUB_USERNAME}`
      ) as any;
      
      return {
        public_repos: response.public_repos,
        followers: response.followers,
        following: response.following,
        public_gists: response.public_gists,
      };
    }),
    
    generateBuildCache('trophies', async () => {
      // Use external trophy API or return empty
      return [];
    }),
  ]);
  
  console.log('Build cache generation complete!');
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1])) {
  generateAllCache().catch(console.error);
}
