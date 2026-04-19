import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    .materia-container { max-width: 800px; margin: 40px auto; padding: 20px; font-family: sans-serif; }
    .materia-imagem img { width: 100%; border-radius: 8px; }
    .btn-voltar { display: inline-block; margin-top: 30px; color: var(--acc); text-decoration: none; font-weight: bold; }
    .navbar { padding: 15px; background: #000; color: white; display:flex; align-items: center; }
    .navbar a { color: white; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>

  <!-- Navbar nativa simples -->
  <nav class="navbar" id="navbar">
    <a href="/" class="logo">← Driver News</a>
  </nav>

  <main class="materia-container">
    <article itemscope itemtype="https://schema.org/NewsArticle">

      <header class="materia-header">
        ${article.category ? `<span style="background:var(--acc);color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:bold;">${escapeHtml(article.category.toUpperCase())}</span>` : ''}
        <h1 class="materia-titulo" itemprop="headline">${escapeHtml(title)}</h1>
        <div style="color:#666; font-size:14px; margin-bottom: 20px;">
          Por <strong>${escapeHtml(authorName)}</strong> &middot; 
          <time class="materia-data" itemprop="datePublished" datetime="${publishedAt}">${new Date(publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</time>
        </div>
      </header>

      ${image ? `<figure class="materia-imagem">
        <img src="${image}" alt="${escapeHtml(title)}" itemprop="image" loading="eager" />
      </figure>` : ''}

      <div class="materia-corpo" itemprop="articleBody" style="line-height: 1.6; margin-top: 20px; font-size: 1.1rem; color: #222;">
        ${article.body ?? summary}
      </div>

    </article>

    <!-- Voltar para home -->
    <a href="/" class="btn-voltar">← Voltar para o portal</a>
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
