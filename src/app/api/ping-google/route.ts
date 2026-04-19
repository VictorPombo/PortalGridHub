export async function POST() {
  const sitemapUrl = encodeURIComponent('https://drivernews.com.br/api/sitemap.xml');

  const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

  try {
    await fetch(pingUrl);
    return Response.json({ ok: true, pinged: pingUrl });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
