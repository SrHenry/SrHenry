import fs from "node:fs/promises";
import path from "node:path";
import { GITHUB_USERNAME } from "../constants";
import { fetchPinnedRepos } from "./github-graphql";

if (!process.env.GITHUB_TOKEN) {
  console.warn("Warning: GITHUB_TOKEN not set. Build cache will use public API limits.");
}

const GITHUB_REST_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "portfolio-srhenry",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface GitHubApiUser {
  public_repos: number;
  followers: number;
  following: number;
}

async function fetchRest<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: GITHUB_REST_HEADERS });
  if (!response.ok) {
    throw new Error(`GitHub REST API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function generateBuildCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  try {
    const data = await fetchFn();
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: 2 * 60 * 60 * 1000,
    };

    const cacheDir = path.join(process.cwd(), "data", "cache");
    await fs.mkdir(cacheDir, { recursive: true });

    await fs.writeFile(path.join(cacheDir, `${key}.json`), JSON.stringify(cacheEntry, null, 2));

    console.log(`✓ Build cache generated: ${key}`);
    return data;
  } catch (error) {
    console.warn(`✗ Failed to generate build cache for ${key}:`, error);
    return [] as unknown as T;
  }
}

export async function generateAllCache() {
  console.log("Generating build cache...");

  await Promise.all([
    generateBuildCache("repos", async () => {
      const repos = await fetchPinnedRepos();
      return repos.map(({ languageColor: _, ...rest }) => rest);
    }),

    generateBuildCache("stats", async () => {
      const response = (await fetchRest(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
      )) as GitHubApiUser;

      return {
        public_repos: response.public_repos || 0,
        followers: response.followers || 0,
        following: response.following || 0,
      };
    }),
  ]);

  console.log("Build cache generation complete!");
}

generateAllCache().catch(console.error);
