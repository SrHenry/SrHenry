import { useEffect, useState } from 'react';

export function useCache<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 2 * 60 * 60 * 1000) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getCachedData = async () => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < ttl) {
            if (isMounted) {
              setData(cachedData);
              setIsLoading(false);
            }
            return;
          }
        }

        const freshData = await fetchFn();
        if (isMounted) {
          setData(freshData);
          setIsLoading(false);
          localStorage.setItem(key, JSON.stringify({ data: freshData, timestamp: Date.now() }));
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    getCachedData();

    return () => {
      isMounted = false;
    };
  }, [key, fetchFn, ttl]);

  return { data, isLoading, error };
}

export function clearCache(key: string) {
  localStorage.removeItem(key);
}

export function clearAllCache() {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('cache:')) {
      localStorage.removeItem(key);
    }
  });
}
