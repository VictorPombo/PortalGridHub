import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, authorId } = body;

    if (!articleId) {
      return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
    }

    const host = 'drivernews.com.br';
    const sitemapUrl = `https://${host}/sitemap.xml`;
    // Hardcodec key created earlier
    const indexNowKey = 'fc8a96401a4e40e69e71050a4d5cd1ff';
    const urls = [
      `https://${host}/materia.html?id=${articleId}`
    ];
    if (authorId) urls.push(`https://${host}/piloto.html?id=${authorId}`);

    const results: any = { indexNow: null, googleSitemap: null, bingSitemap: null, googleApi: null };

    // 1. IndexNow Ping
    try {
      const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, key: indexNowKey, urlList: urls })
      });
      results.indexNow = indexNowRes.ok ? 'success' : await indexNowRes.text();
    } catch (e: any) { results.indexNow = e.message; }

    // 2. Google Sitemap Ping
    try {
      const gRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      results.googleSitemap = gRes.ok ? 'success' : await gRes.text();
    } catch (e: any) { results.googleSitemap = e.message; }

    // 3. Bing Sitemap Ping
    try {
      const bRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      results.bingSitemap = bRes.ok ? 'success' : await bRes.text();
    } catch (e: any) { results.bingSitemap = e.message; }

    // 4. Google Indexing API (Optional)
    if (process.env.GOOGLE_INDEXING_KEY) {
      try {
         // Placeholder architecture for Google API inside the server.
         // Real JWT singing logic requires 'google-auth-library' which might not be installed.
         results.googleApi = 'Key detected. Integration requires google-auth-library.';
      } catch (e: any) { results.googleApi = e.message; }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Ping Google Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
