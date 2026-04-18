import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Tentar carregar HTML base
    const filePath = path.join(process.cwd(), 'public', '_materia_base.html');
    let html = fs.readFileSync(filePath, 'utf8');

    if (id) {
      const { data: article } = await supabase
        .from('articles')
        .select(`
          title, brief, img, published_at, submitted_at,
          users:author_id ( name, slug )
        `)
        .eq('id', id)
        .single();

      if (article) {
        const title = (article.title || 'Driver News — Matéria').replace(/"/g, '&quot;');
        const desc = (article.brief || 'Leia esta matéria exclusiva na Driver News.').replace(/"/g, '&quot;');
        const imgUrl = article.img || 'https://www.drivernews.com.br/images/share.jpg';
        const canonicalUrl = `https://www.drivernews.com.br/materia.html?id=${id}`;
        const siteName = 'Driver News';

        const authorObj: any = Array.isArray(article.users) ? article.users[0] : article.users;
        const authorName = authorObj?.name || 'Driver News Redação';
        const authorSlug = authorObj?.slug || authorObj?.id || 'equipe';
        const datePub = article.published_at || article.submitted_at || new Date().toISOString();

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": title,
          "image": [
            imgUrl
          ],
          "datePublished": datePub,
          "author": {
            "@type": "Person",
            "name": authorName,
            "url": `https://www.drivernews.com.br/piloto.html?id=${authorSlug}`
          },
          "publisher": {
            "@type": "Organization",
            "name": "Driver News",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.drivernews.com.br/images/logo.png"
            }
          }
        };

        const metaTags = `
<!-- Dynamic OG Tags Injected Server-Side -->
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${imgUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${siteName}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${imgUrl}">
<link rel="canonical" href="${canonicalUrl}">
<script>
  window.__PRELOADED_ARTICLE_ID = "${id}";
</script>
`;
        html = html.replace('</head>', metaTags + '</head>');
      }
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    console.error('Erro na API OG-materia:', err);
    try {
       const filePath = path.join(process.cwd(), 'public', '_materia_base.html');
       let html = fs.readFileSync(filePath, 'utf8');
       return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch(e) {
       return new NextResponse('Erro Interno. Matéria Indisponível', { status: 500 });
    }
  }
}
