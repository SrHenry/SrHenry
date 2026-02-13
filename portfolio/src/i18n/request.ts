import { getRequestConfig } from 'next-intl/server';
import { messages, isValidLocale } from '../lib/i18n/config';

export const locales = ['en', 'pt-BR'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const validLocale = isValidLocale(locale) ? locale : defaultLocale;
  return { 
    locale: validLocale,
    messages: messages[validLocale] 
  };
});
