import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Carregar HTML base (agora escondido em _materia_base.html)
    const filePath = path.join(process.cwd(), 'public', '_materia_base.html');
    let html = fs.readFileSync(filePath, 'utf8');

    // Se tiver ID válido, buscar matéria no BD e injetar tags OG
    if (id) {
      const { data: article } = await supabase
        .from('articles')
        .select('title, brief, img')
        .eq('id', id)
        .single();

      if (article) {
        // Fallbacks
        const title = (article.title || 'Driver News — Matéria').replace(/"/g, '&quot;');
        const desc = (article.brief || 'Leia esta matéria exclusiva na Driver News.').replace(/"/g, '&quot;');
        const imgUrl = article.img || 'https://www.drivernews.com.br/images/share.jpg'; // ideal ter fallback generalista
        const canonicalUrl = `https://www.drivernews.com.br/materia.html?id=${id}`;
        const siteName = 'Driver News';

        const metaTags = `
<!-- Dynamic OG Tags Injected by Interceptor -->
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
`;

        // Substitui antes do fechamento do head
        html = html.replace('</head>', metaTags + '</head>');
      }
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    console.error('Erro na API OG-materia:', err);
    // Em caso de falha severa, retornar pelo menos um html padrão ou fallback html vazio?
    // Melhor tentar retornar o html puro do filesystem pra não crashar a página do usuário.
    try {
       const filePath = path.join(process.cwd(), 'public', '_materia_base.html');
       let html = fs.readFileSync(filePath, 'utf8');
       return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch(e) {
       return new NextResponse('Erro Interno. Matéria Indisponível', { status: 500 });
    }
  }
}
