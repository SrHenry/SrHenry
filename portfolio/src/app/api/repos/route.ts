import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { GitHubRepo } from '@/types';
import { CACHE_TTL } from '@/lib/constants';

export const dynamic = "force-static";

const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'repos.json');

interface CacheEntry {
  data: GitHubRepo[];
  timestamp: number;
  ttl: number;
}

export async function GET(request: NextRequest) {
  try {
    try {
      const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
      const cacheEntry: CacheEntry = JSON.parse(cacheContent);
      
      if (Date.now() - cacheEntry.timestamp < cacheEntry.ttl) {
        return NextResponse.json(cacheEntry.data);
      }
    } catch (error) {
      console.log('Cache miss for repos');
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error in repos API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
