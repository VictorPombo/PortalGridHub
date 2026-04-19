import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, submitted_at, id')
    .eq('deleted', false)
    .eq('status', 'published');

  const { data: pilots } = await supabase
    .from('users')
    .select('id, slug, created_at')
    .eq('status', 'active');

  const base = 'https://drivernews.com.br';

  const artigoUrls = (articles ?? []).map((a: any) => {
    const rawDate = a.published_at || a.submitted_at || new Date().toISOString();
    return `
  <url>
    <loc>${base}/materia.html?id=${a.id}</loc>
    <lastmod>${new Date(rawDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const pilotoUrls = (pilots ?? []).map((p: any) => {
    const rawDate = p.created_at || new Date().toISOString();
    const cleanId = p.slug || p.id;
    return `
  <url>
    <loc>${base}/piloto.html?id=${cleanId}</loc>
    <lastmod>${new Date(rawDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${artigoUrls}${pilotoUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600'
    }
  });
}
