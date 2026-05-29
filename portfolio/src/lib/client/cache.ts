import { useEffect, useState } from "react";
import { CACHE_TTL } from "@/lib/constants";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function readCache<T>(key: string, ttl: number): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const entry: CacheEntry<T> = JSON.parse(raw);
  return Date.now() - entry.timestamp < ttl ? entry.data : null;
}

function writeCache<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

function handleSuccess<T>(
  result: T,
  key: string,
  isMounted: boolean,
  setData: (d: T | null) => void,
  setIsLoading: (v: boolean) => void,
) {
  if (!isMounted) return;
  setData(result);
  setIsLoading(false);
  writeCache(key, result);
}

function handleError(
  err: unknown,
  isMounted: boolean,
  setError: (e: Error | null) => void,
  setIsLoading: (v: boolean) => void,
) {
  if (!isMounted) return;
  setError(err as Error);
  setIsLoading(false);
}

export function useCache<T>(key: string, fetchFn: () => Promise<T>, ttl: number = CACHE_TTL) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const cached = readCache<T>(key, ttl);
    if (cached !== null) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    fetchFn()
      .then((fresh) => handleSuccess(fresh, key, isMounted, setData, setIsLoading))
      .catch((err) => handleError(err, isMounted, setError, setIsLoading));

    return () => {
      isMounted = false;
    };
  }, [key, ttl, fetchFn]);

  return { data, isLoading, error };
}

export function clearCache(key: string) {
  localStorage.removeItem(key);
}

export function clearAllCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("cache:")) {
      localStorage.removeItem(key);
    }
  });
}
