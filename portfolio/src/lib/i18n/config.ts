export const locales = ['en', 'pt-BR'] as const;
export const defaultLocale = 'en';

export type Locale = typeof locales[number];

// Messages are imported statically
import enMessages from '../../messages/en.json';
import ptBRMessages from '../../messages/pt-BR.json';

export const messages = {
  en: enMessages,
  'pt-BR': ptBRMessages,
};

export function getMessages(locale: string) {
  if (isValidLocale(locale)) {
    return messages[locale];
  }
  return messages[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function normalizeLocale(rawLocale: string): Locale | null {
  const normalized = rawLocale.toLowerCase().replace('_', '-');
  
  // Exact match
  if (isValidLocale(normalized)) return normalized;
  
  // Match language prefix (en-US -> en, pt-BR -> pt-BR)
  const [language] = normalized.split('-');
  if (language === 'en') return 'en';
  if (language === 'pt') return 'pt-BR';
  
  return null;
}
