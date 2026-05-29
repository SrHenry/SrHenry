import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { GitHubRepo } from "@/types";

export const dynamic = "force-static";

const CACHE_DIR = path.join(process.cwd(), "data", "cache");
const CACHE_FILE = path.join(CACHE_DIR, "repos.json");

interface CacheEntry {
  data: GitHubRepo[];
  timestamp: number;
  ttl: number;
}

async function readBuildCache(): Promise<GitHubRepo[]> {
  try {
    const cacheContent = await fs.readFile(CACHE_FILE, "utf-8");
    const cacheEntry: CacheEntry = JSON.parse(cacheContent);
    return cacheEntry.data;
  } catch {
    return [];
  }
}

export async function GET() {
  const repos = await readBuildCache();
  return NextResponse.json(repos);
}
