import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../lib/supabase';

export const revalidate = 300; // Cache de 5min
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const baseUrl = 'https://www.drivernews.com.br';

    // Buscar Usuários (Pilotos/Criadores) - Somente ativos
    const { data: users, error: errUsers } = await supabase
      .from('users')
      .select('slug, id, updated_at')
      .eq('is_active', true);

    // Buscar Matérias Publicadas
    const { data: articles, error: errArticles } = await supabase
      .from('articles')
      .select('id, updated_at, published_at')
      .eq('status', 'published');

    if (errUsers || errArticles) {
      throw new Error('Erro ao compilar entidades do banco');
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Routes
    xml += `
      <url>
        <loc>${baseUrl}/</loc>
        <changefreq>always</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/pilotos</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    `;

    // Dynamic Routes para as Entidades (Pilotos)
    if (users) {
      users.forEach(user => {
        const idStr = user.slug || user.id;
        // Prioridade maior para entidades autorais
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/usuario/${idStr}</loc>\n`;
        xml += `    <lastmod>${new Date(user.updated_at || new Date()).toISOString()}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    // Dynamic Routes para Matérias
    if (articles) {
      articles.forEach(article => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/materia/${article.id}</loc>\n`;
        xml += `    <lastmod>${new Date(article.updated_at || article.published_at || new Date()).toISOString()}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Erro na geração do Sitemap:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', 
      {
         status: 500,
         headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'no-store' }
      }
    );
  }
}
