import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!article || error) {
    return new Response('<html><body><h1>Matéria não encontrada</h1><a href="/">Voltar para o Início</a></body></html>', {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  const title = article.title ?? '';
  const summary = article.brief ?? article.body?.slice(0, 160) ?? '';
  const image = article.img ?? 'https://drivernews.com.br/images/share.jpg';
  const url = `https://drivernews.com.br/materia/${article.slug}`;
  const publishedAt = article.published_at || article.submitted_at || new Date().toISOString();
  
  // Try to find author name if users object is joined, otherwise default
  let authorName = 'Driver News';
  if (article.users && article.users.name) {
    authorName = article.users.name;
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — Driver News</title>

  <!-- SEO básico -->
  <meta name="description" content="${escapeHtml(summary)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(summary)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Driver News" />
  <meta property="article:published_time" content="${publishedAt}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(summary)}" />
  <meta name="twitter:image" content="${image}" />

  <!-- JSON-LD estruturado (ranqueia melhor no Google) -->
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": summary,
    "image": [image],
    "datePublished": publishedAt,
    "publisher": {
      "@type": "Organization",
      "name": "Driver News",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drivernews.com.br/images/logo.png"
      }
    },
    "url": url
  })}
  </script>

  <link rel="stylesheet" href="/css/core.css?v=20260420" />
  <link rel="stylesheet" href="/css/style.css?v=20260420" />
  <style>
    /* Premium Article Layout */
    body { background-color: var(--bg0, #0a0a0a); color: rgba(255, 255, 255, 0.85); font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; line-height: 1.7; }
    
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 100; }
    .navbar a { color: #fff; text-decoration: none; font-family: var(--fu, 'Bebas Neue', sans-serif); font-size: 24px; letter-spacing: 1.5px; transition: 0.3s; }
    .navbar a:hover { color: var(--acc, #E8002D); }

    .materia-container { max-width: 760px; margin: 60px auto; padding: 0 30px; }
    
    .materia-header { margin-bottom: 40px; text-align: center; }
    .materia-cat { display: inline-block; background: var(--acc, #E8002D); color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(232,0,45,0.3); }
    .materia-titulo { font-family: var(--fd, 'Outfit', sans-serif); font-size: 42px; font-weight: 800; line-height: 1.2; color: #fff; margin: 0 0 24px; letter-spacing: -1px; text-wrap: balance; }
    
    .materia-meta { display: flex; align-items: center; justify-content: center; gap: 15px; color: rgba(255,255,255,0.5); font-size: 14px; font-family: var(--fm, monospace); }
    .materia-meta strong { color: #fff; }
    
    .materia-imagem { margin: 0 0 50px; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .materia-imagem img { width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 16/9; }
    .materia-imagem::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 30%; background: linear-gradient(to top, var(--bg0, #0a0a0a), transparent); }
    
    .materia-corpo { font-size: 18px; line-height: 1.8; color: rgba(255,255,255,0.85); margin-bottom: 60px; }
    .materia-corpo p { margin-bottom: 2em; }
    .materia-corpo h2, .materia-corpo h3 { font-family: var(--fd, 'Outfit', sans-serif); color: #fff; margin: 2em 0 1em; line-height: 1.3; }
    
    .materia-footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; }
    .btn-voltar { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
    .btn-voltar:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    
    @media (max-width: 768px) {
      .navbar { padding: 15px 20px; }
      .materia-titulo { font-size: 32px; }
      .materia-container { margin: 30px auto; }
      .materia-corpo { font-size: 16px; }
    }
  </style>
</head>
<body>

  <nav class="navbar" id="navbar">
    <a href="/" class="logo">DRIVER NEWS</a>
  </nav>

  <main class="materia-container">
    <article itemscope itemtype="https://schema.org/NewsArticle">

      <header class="materia-header">
        ${article.category ? `<span class="materia-cat">${escapeHtml(article.category)}</span>` : ''}
        <h1 class="materia-titulo" itemprop="headline">${escapeHtml(title)}</h1>
        <div class="materia-meta">
          <span>Por <strong>${escapeHtml(authorName)}</strong></span>
          <span>&middot;</span>
          <time itemprop="datePublished" datetime="${publishedAt}">${new Date(publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</time>
        </div>
      </header>

      ${image ? `<figure class="materia-imagem">
        <img src="${image}" alt="${escapeHtml(title)}" itemprop="image" loading="eager" />
      </figure>` : ''}

      <div class="materia-corpo" itemprop="articleBody">
        ${article.body ?? summary}
      </div>

    </article>

    <div class="materia-footer">
      <a href="/" class="btn-voltar">← Voltar para o portal</a>
    </div>
  </main>

  <script src="/js/state.js?v=20260420"></script>
  <script src="/js/app.js?v=20260420"></script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
