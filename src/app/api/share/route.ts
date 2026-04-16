import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '';
  const title = searchParams.get('t') || 'PitLane News';
  const img = searchParams.get('i') || 'https://www.pitlanenews.com/img/og-default.jpg';
  const desc = searchParams.get('d') || 'Acompanhe as últimas notícias do automobilismo no PitLane News.';

  // Default redirect is homepage if no ID
  const redirectUrl = id ? `/index.html?art=${id}` : '/index.html';

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | PitLane News</title>
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${img}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://pitlanenews.com${redirectUrl}">
  <meta property="og:site_name" content="PitLane News">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${img}">

  <!-- Redirection script (only executes on real browsers, crawlers ignore this) -->
  <script>
    window.location.href = "${redirectUrl}";
  </script>
</head>
<body style="background:#000; color:#fff; font-family:sans-serif; text-align:center; padding-top:50px;">
  <p>Redirecionando para a notícia...</p>
  <p><a href="${redirectUrl}" style="color:#e8002d;">Clique aqui se não for redirecionado automaticamente.</a></p>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      // Cache this for a while since it's just meta tags
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
