import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const locales = ['en', 'pt-BR'] as const;
export const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle root path (no locale)
  if (pathname === '/') {
    // Redirect to default locale
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }
  
  // Check if first segment is a locale
  const pathnameParts = pathname.split('/');
  const firstSegment = pathnameParts[1];
  
  if (locales.includes(firstSegment as any)) {
    // Valid locale, continue
    return NextResponse.next();
  }
  
  // Invalid locale, redirect to default
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/', '/((?!_next|api|_vercel|.*\..*).*)'],
};
