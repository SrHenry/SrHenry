import { getRequestConfig } from 'next-intl/server';
import enMessages from '../messages/en.json';
import ptBRMessages from '../messages/pt-BR.json';

export default getRequestConfig(async ({ locale = 'en' }) => {
  const messages = locale === 'pt-BR' ? ptBRMessages : enMessages;
  return { locale, messages };
});
