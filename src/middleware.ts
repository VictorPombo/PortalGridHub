import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // If no ID is provided, just serve the normal static page
  if (!id) return NextResponse.next();

  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitterbot|linkedinbot|pinterest|slackbot|discordbot/i.test(userAgent);

  // If it's a real user on a browser, let them load the normal React/HTML static code
  if (!isBot) return NextResponse.next();

  // If it's a bot, fetch the specific article from Supabase at the edge
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // We use the service key because RLS might prevent anon reads if not configured properly, ensure stability for bot scraping
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${id}&select=title,brief,img,id`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      // Cache the response briefly so we don't bombard DB if a link goes viral
      next: { revalidate: 60 }
    });

    if (!res.ok) return NextResponse.next();

    const data = await res.json();
    if (!data || data.length === 0) return NextResponse.next();

    const article = data[0];

    // Build heavily optimized static HTML string containing solely the Open Graph tags required for rich link unfurling
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${article.title}</title>
  
  <!-- Open Graph Data for WhatsApp, Facebook, LinkedIn -->
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${article.brief || ''}">
  <meta property="og:image" content="${article.img || ''}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://www.drivernews.com.br/materia.html?id=${id}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Driver News">
  
  <!-- Twitter Card Data -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${article.title}">
  <meta name="twitter:description" content="${article.brief || ''}">
  <meta name="twitter:image" content="${article.img || ''}">

  <!-- Fallback redirect if a weird browser ever receives this payload -->
  <script>
    if(!/bot|facebook|whatsapp|telegram/i.test(navigator.userAgent)){
       window.location.replace("/materia.html?id=${id}");
    }
  </script>
</head>
<body>
  <h1>${article.title}</h1>
  <p>${article.brief}</p>
  <img src="${article.img}" alt="Article Cover" />
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (err) {
    console.error('Middleware OpenGraph Fetch Error:', err);
    return NextResponse.next();
  }
}

// Tell Next.js middleware to only intercept our static HTML article page
export const config = {
  matcher: ['/materia.html'],
};
