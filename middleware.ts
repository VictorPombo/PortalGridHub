import { NextRequest, NextResponse } from 'next/server';

const BOT_REGEX = /googlebot|google-inspectiontool|bingbot|yandex|facebookexternalhit|whatsapp|twitterbot|linkedinbot|applebot|duckduckbot|slurp|pinterest|baiduspider/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const { pathname, searchParams } = request.nextUrl;

  // Nunca interceptar rotas de API nativas
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // Interceptar materia.html
  if (pathname === '/materia.html') {
    const url = request.nextUrl.clone();
    if (BOT_REGEX.test(ua) && searchParams.get('id')) {
      url.pathname = '/api/og/materia';
    } else {
      url.pathname = '/_materia_fallback.html';
    }
    return NextResponse.rewrite(url);
  }

  // Interceptar piloto.html
  if (pathname === '/piloto.html') {
    const url = request.nextUrl.clone();
    if (BOT_REGEX.test(ua) && searchParams.get('id')) {
      url.pathname = '/api/og/piloto';
    } else {
      url.pathname = '/_piloto_fallback.html';
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/materia.html', '/piloto.html'],
};
