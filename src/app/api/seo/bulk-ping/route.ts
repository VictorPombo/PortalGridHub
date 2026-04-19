import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (token !== 'SEO_BULK_2026') {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 403 });
    }

    const { data: articles, error } = await supabase
      .from('articles')
      .select('id')
      .eq('status', 'published')
      .eq('deleted', false);

    if (error) throw error;
    if (!articles || articles.length === 0) return NextResponse.json({ success: true, count: 0 });

    const host = 'drivernews.com.br';
    const sitemapUrl = `https://${host}/sitemap.xml`;
    const indexNowKey = 'fc8a96401a4e40e69e71050a4d5cd1ff';

    const urls = articles.map(a => `https://${host}/materia.html?id=${a.id}`);
    
    // Split into chunks of 100 for safety, but usually IndexNow supports up to 10k
    const chunkSize = 100;
    const results: any[] = [];
    let processed = 0;

    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);
      try {
        const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host, key: indexNowKey, urlList: chunk })
        });
        results.push({ chunk: i, status: indexNowRes.ok ? 'success' : await indexNowRes.text() });
      } catch(e) {}
      processed += chunk.length;
    }

    // Ping map
    try { await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`); } catch(e){}
    try { await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`); } catch(e){}

    return NextResponse.json({ success: true, submitted: processed, chunks: results });

  } catch (error: any) {
    console.error('Bulk Ping Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
