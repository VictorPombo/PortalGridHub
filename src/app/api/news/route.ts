import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // 1 hora
export const dynamic = 'force-dynamic';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  image_url: string;
  category: string;
  tipo: 'mundial' | 'br';
  published_at: string;
}

const parser = new Parser();

const FEEDS_MUNDIAL = [
  { url: "https://www.motorsport.com/rss/f1/news/", name: "Motorsport F1 Global", cat: "F1" },
  { url: "https://www.motorsport.com/rss/motogp/news/", name: "Motorsport MotoGP Global", cat: "MotoGP" },
  { url: "https://www.motorsport.com/rss/wec/news/", name: "WEC Global", cat: "Endurance" }
];

const FEEDS_BRASIL = [
  { url: "https://br.motorsport.com/rss/f1/news/", name: "Motorsport BR", cat: "F1" },
  { url: "https://br.motorsport.com/rss/motogp/news/", name: "Motorsport BR", cat: "MotoGP" },
  { url: "https://br.motorsport.com/rss/stockcar-br/news/", name: "Motorsport BR", cat: "Stock Car" },
  { url: "https://br.motorsport.com/rss/wec/news/", name: "Motorsport BR", cat: "Endurance" },
  { url: "https://br.motorsport.com/rss/all/news/", name: "Motorsport BR All", cat: "Geral" } // Para não ficar sem
];

function extractImage(item: any): string {
  let img = item.enclosure?.url || '';
  if (!img && item['media:content']) img = item['media:content']['$']?.url || '';
  if (!img && item.thumbnail) img = item.thumbnail;
  if (!img && item.content) {
    const m = item.content.match(/src="([^"]+)"/);
    if (m) img = m[1];
  }
  return img || 'https://images.unsplash.com/photo-1538356396417-6d601dff87f7?q=80&w=2070&auto=format&fit=crop';
}

async function fetchAndProcessFeeds(feedsConfig: typeof FEEDS_MUNDIAL, tipo: 'mundial'|'br'): Promise<NewsItem[]> {
  const promises = feedsConfig.map(async feedConf => {
    try {
      const feed = await parser.parseURL(feedConf.url);
      return feed.items.map(item => ({
        id: item.guid || Math.random().toString(),
        title: item.title || '',
        source: feedConf.name,
        url: item.link || '',
        image_url: extractImage(item),
        category: feedConf.cat,
        tipo: tipo,
        published_at: item.pubDate || new Date().toISOString()
      }));
    } catch(err) {
      console.warn(`Failed to parse ${feedConf.url}`);
      return [];
    }
  });

  const results = await Promise.all(promises);
  let allNews: NewsItem[] = results.flat();

  // Deduplicação (especialmente pedida para BR e útil em todos)
  const seenTitles = new Set();
  allNews = allNews.filter(n => {
    if (seenTitles.has(n.title)) return false;
    seenTitles.add(n.title);
    return true;
  });

  // Ordenação descendente
  allNews.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  // Limite de 20
  return allNews.slice(0, 20);
}

export async function GET() {
  try {
    const [mundialNews, brNews] = await Promise.all([
      fetchAndProcessFeeds(FEEDS_MUNDIAL, 'mundial'),
      fetchAndProcessFeeds(FEEDS_BRASIL, 'br')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        mundial: mundialNews,
        br: brNews
      }
    });

  } catch (error) {
    console.error("API News Pipeline Error:", error);
    return NextResponse.json({ error: "Failed to fetch aggregated feeds" }, { status: 500 });
  }
}
