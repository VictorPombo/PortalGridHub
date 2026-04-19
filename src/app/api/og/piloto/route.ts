import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Tentar carregar HTML base
    // Tentar carregar HTML base do piloto
    const filePath = path.join(process.cwd(), 'public', 'piloto.html');
    let html = fs.readFileSync(filePath, 'utf8');

    if (id) {
      const { data: pilot } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (pilot) {
        const title = (pilot.name || 'Piloto Driver News').replace(/"/g, '&quot;');
        const cat = pilot.category || 'Automobilismo';
        const desc = `Confira o perfil, currículo e vitórias do piloto ${title} na Driver News. Categoria: ${cat}.`.replace(/"/g, '&quot;');
        let imgUrl = pilot.avatar_url || pilot.cover_url || 'https://www.drivernews.com.br/images/share.jpg';
        if (imgUrl.startsWith('data:image/')) {
          imgUrl = `https://www.drivernews.com.br/api/image?type=pilot&id=${id}`;
        }
        const canonicalUrl = `https://www.drivernews.com.br/piloto.html?id=${id}`;
        const siteName = 'Driver News';

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "name": title,
            "description": desc,
            "image": imgUrl,
            "jobTitle": "Piloto de " + cat,
            "url": canonicalUrl
          }
        };

        const metaTags = `
<!-- Dynamic SEO & OG Tags Server-Side -->
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>
<title>${title} | Perfil do Piloto na Driver News</title>
<meta name="description" content="${desc}">
<meta name="author" content="${title}">
<meta name="keywords" content="${title}, piloto, automobilismo, corrida, ${cat}, patrocínio">
<meta property="og:title" content="${title} - Piloto na Driver News">
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
        
        // Remove default title if it exists to avoid duplication
        html = html.replace(/<title>.*<\/title>/i, '');
        html = html.replace('</head>', metaTags + '</head>');
        
        // Substituir o container original pelo HTML estático (para bots nunca lidarem com renders JS)
        const botHtmlContent = `
<div id="pilotContainer" class="seo-crawler-content">
  <div class="pilot-header">
    <div class="pilot-wrap">
      <h1>Piloto: ${title}</h1>
      <img src="${imgUrl}" alt="Avatar de ${title}" style="max-width:200px" />
      <h2>Categoria: ${cat}</h2>
      <div>${desc}</div>
    </div>
  </div>
</div>
`;
        html = html.replace(/<div id="pilotContainer">[\s\S]*?<\/div>/, botHtmlContent);
        
        // MATAR Javascripts client-side para GoogleBot não cair no callback renderError
        html = html.replace(/<script src="\/js\/core\.js">[\s\S]*?<\/script>/, '');
        html = html.replace(/<script src="\/js\/state\.js[\s\S]*?<\/script>/, '');
        html = html.replace(/<script>[\s\S]*?loadPilotData\(\);[\s\S]*?<\/script>/, '');
      }
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    console.error('Erro na API OG-piloto:', err);
    try {
       const filePath = path.join(process.cwd(), 'public', 'piloto.html');
       let html = fs.readFileSync(filePath, 'utf8');
       return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch(e) {
       return new NextResponse('Erro Interno. Matéria Indisponível', { status: 500 });
    }
  }
}
