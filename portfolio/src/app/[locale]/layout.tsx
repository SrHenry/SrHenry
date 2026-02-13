import '../globals.css';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/providers/theme-provider';
import enMessages from '../../messages/en.json';
import ptBRMessages from '../../messages/pt-BR.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SrHenry Portfolio',
  description: 'Full-stack web developer with backend specialization since 2016 - Portfolio',
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = await params;
  const messages = locale === 'pt-BR' ? ptBRMessages : enMessages;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
