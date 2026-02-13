import { default as en } from '../../messages/en.json';
import { default as ptBR } from '../../messages/pt-BR.json';

export const locales = ['en', 'pt-BR'] as const;
export const defaultLocale: Locale = 'en';

export type Locale = typeof locales[number];

export const messages = {
  en,
  'pt-BR': ptBR,
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  'pt-BR': 'Português (BR)',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function normalizeLocale(rawLocale: string): Locale | null {
  const normalized = rawLocale.toLowerCase().replace('_', '-');
  
  // Exact match
  if (isValidLocale(normalized)) return normalized;
  
  // Match language prefix (en-US -> en)
  const [language] = normalized.split('-');
  if (language === 'en') return 'en';
  if (language === 'pt') return 'pt-BR';
  
  return null;
}
