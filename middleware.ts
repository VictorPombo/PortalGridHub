import { NextRequest, NextResponse } from 'next/server';

const BOT_REGEX = /googlebot|google-inspectiontool|bingbot|yandex|facebookexternalhit|whatsapp|twitterbot|linkedinbot|applebot|duckduckbot|slurp|pinterest|baiduspider/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const { pathname, searchParams } = request.nextUrl;

  // Nunca interceptar rotas de API
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // Só interceptar materia.html e piloto.html para bots
  if (BOT_REGEX.test(ua)) {
    if (pathname === '/materia.html' && searchParams.get('id')) {
      const url = request.nextUrl.clone();
      url.pathname = '/api/og/materia';
      return NextResponse.rewrite(url);
    }
    if (pathname === '/piloto.html' && searchParams.get('id')) {
      const url = request.nextUrl.clone();
      url.pathname = '/api/og/piloto';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/materia.html', '/piloto.html'],
};
