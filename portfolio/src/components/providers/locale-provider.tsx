'use client';

import { ReactNode, useEffect, useOptimistic } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useOptimistic(false);

  useEffect(() => {
    const detectAndSwitchLocale = async () => {
      const browserLocale = navigator.language || navigator.languages?.[0];
      if (browserLocale?.startsWith('pt') && !pathname.startsWith('/pt-BR')) {
        router.replace('/pt-BR' + pathname);
      } else if (!pathname.startsWith('/en') && !pathname.startsWith('/pt-BR')) {
        router.replace('/en' + pathname);
      }
    };

    detectAndSwitchLocale().finally(() => setIsReady(true));
  }, [router, pathname]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
