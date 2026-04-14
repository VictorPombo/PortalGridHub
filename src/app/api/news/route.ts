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
  { url: "https://br.motorsport.com/rss/f1/news/", name: "Motorsport Brasil (F1)", cat: "F1" },
  { url: "https://br.motorsport.com/rss/motogp/news/", name: "Motorsport Brasil (MotoGP)", cat: "MotoGP" },
  { url: "https://br.motorsport.com/rss/wec/news/", name: "Motorsport Brasil (WEC)", cat: "Endurance" }
];

const FEEDS_BRASIL = [
  { url: "https://br.motorsport.com/rss/stockcar-br/news/", name: "Motorsport Brasil (Stock Car)", cat: "Stock Car" },
  { url: "https://br.motorsport.com/rss/all/news/", name: "Motorsport Brasil (Geral)", cat: "Geral" }
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
  return img || 'https://upload.wikimedia.org/wikipedia/commons/3/3f/FIA_F1_Austria_2023_Nr._44_%282%29.jpg';
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
  // Deduplicação (Anti-Clonagem)
  const seenImgs = new Set();
  const seenTitles = new Set();
  
  allNews = allNews.filter(n => {
    // 1. Checa a imagem (veiculos de uma mesma rede usam a mesma foto pra mesma noticia)
    if (n.image_url && n.image_url.length > 30) {
      if (seenImgs.has(n.image_url)) return false;
      seenImgs.add(n.image_url);
    }
    
    // 2. Checa o titulo (baseado apenas nos 30 primeiros caracteres para burlar caracteres especiais)
    const shortTitle = n.title.substring(0, 30).toLowerCase();
    if (seenTitles.has(shortTitle)) return false;
    seenTitles.add(shortTitle);
    
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
