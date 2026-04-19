import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Tentar carregar HTML base
    const filePath = path.join(process.cwd(), 'public', '_materia_base.html');
    let html = fs.readFileSync(filePath, 'utf8');

    if (id) {
      // Read via raw fetch to bypass PostgREST cache issues exactly like the other dev did
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=title,brief,body,img,category,published_at,submitted_at,users:author_id(name,id)&id=eq.${id}`,
        {
          headers: { apikey: key!, Authorization: `Bearer ${key}` },
          cache: 'no-store'
        }
      );
      
      const articlesData = await res.json();
      const article = articlesData?.[0];

      if (article) {
        const title = (article.title || 'Driver News — Matéria').replace(/"/g, '&quot;');
        const desc = (article.brief || 'Leia esta matéria exclusiva na Driver News.').replace(/"/g, '&quot;');
        let imgUrl = article.img;
        if (!imgUrl) {
          const numId = parseInt((id || '0').replace(/\\D/g, '')) || 1;
          imgUrl = `https://loremflickr.com/1200/630/racing?lock=${numId}`;
        } else if (imgUrl.startsWith('data:image/')) {
          imgUrl = `https://www.drivernews.com.br/api/image?type=article&id=${id}`;
        }

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
          "articleBody": (article.body || desc).replace(/(<([^>]+)>)/gi, ""),
          "image": [
            imgUrl
          ],
          "datePublished": datePub,
          "dateModified": datePub,
          "description": desc,
          "mainEntityOfPage": canonicalUrl,
          "author": {
            "@type": "Person",
            "name": authorName,
            "url": `https://drivernews.com.br/piloto.html?id=${authorSlug}`
          },
          "publisher": {
            "@type": "Organization",
            "name": "Driver News",
            "logo": {
              "@type": "ImageObject",
              "url": "https://drivernews.com.br/images/logo.png"
            }
          }
        };

        const metaTags = `
<!-- Dynamic SEO & OG Tags Server-Side -->
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>
<title>${title} — ${authorName} | Driver News</title>
<meta name="description" content="${desc}">
<meta name="author" content="${authorName}">
<meta name="keywords" content="${authorName}, automobilismo, corrida, piloto, ${title.split(' ').slice(0, 5).join(', ')}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${imgUrl}">
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
        
        // Remove default title if it exists to avoid duplication
        html = html.replace(/<title>.*<\/title>/i, '');
        // Injeta as tags no ÍNICIO do <head> para priorizá-las para os robôs do Facebook/WhatsApp
        html = html.replace('<head>', '<head>\n' + metaTags);
        
        const botHtmlContent = `
<div id="articleContainer">
  <header class="materia-header">
    <div class="materia-wrap">
      <span class="m-cat">${article.category || 'Notícia'}</span>
      <h1 class="m-title">${title}</h1>
      <div class="m-author">
        <div class="m-author-info">
          <span class="m-author-name">${authorName}</span>
          Publicado em ${new Date(datePub).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  </header>
  <main class="m-content">
    ${imgUrl && !imgUrl.includes('share.jpg') ? '<img src="' + imgUrl + '" class="m-content-img" alt="' + title + '">' : ''}
    <article class="m-body">
      ${article.body || desc}
    </article>
  </main>
</div>`;

        // Substituir o container original pelo HTML preenchido
        html = html.replace(/<div id="articleContainer">[\s\S]*?<\/div>/, botHtmlContent);

        // ARRANCAR scripts do final para garantir que o javascript no client (renderError)
        // do fallback nunca execute no browser headless do Google, garantindo 200 OK absoluto
        html = html.replace(/<script src="\/js\/core\.js">[\s\S]*?<\/script>/, '');
        html = html.replace(/<script src="\/js\/state\.js[\s\S]*?<\/script>/, '');
        html = html.replace(/<script>[\s\S]*?loadArticleData\(\);[\s\S]*?<\/script>/, '');
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
