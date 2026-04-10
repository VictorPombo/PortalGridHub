import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

export const revalidate = 60; // 1 minuto de cache Vercel
export const dynamic = 'force-dynamic';

export async function GET() {
  const parser = new Parser();

  const feedsBrasil = [
    "https://br.motorsport.com/rss/f1/news/",
    "https://br.motorsport.com/rss/motogp/news/",
    "https://br.motorsport.com/rss/all/news/"
  ];
  
  const feedsGlobal = [
    "https://www.motorsport.com/rss/f1/news/",
    "https://www.autosport.com/rss/f1/news/",
    "https://www.motorsport.com/rss/wec/news/"
  ];

  try {
    // Busca em Paralelo de Tudo (Promise.all)
    const [brResults, globalResults] = await Promise.all([
      Promise.all(feedsBrasil.map(url => parser.parseURL(url).catch(() => null))),
      Promise.all(feedsGlobal.map(url => parser.parseURL(url).catch(() => null)))
    ]);

    // Set para Desduplicação (Anti-notícia Repetida)
    const brTitles = new Set();
    const globalTitles = new Set();
    
    let brNews = [];
    let globalNews = [];

    // Limpeza Brasil
    brResults.forEach(feed => {
      if (!feed) return;
      feed.items.forEach(item => {
        if (!brTitles.has(item.title)) {
          brTitles.add(item.title);
          
          let img = item.enclosure?.url || '';
          if (!img && item['media:content']) img = item['media:content']['$']?.url || '';
          if (!img) img = 'https://images.unsplash.com/photo-1538356396417-6d601dff87f7?q=80&w=2070&auto=format&fit=crop'; // Fallback

          brNews.push({
            id: item.guid || Math.random().toString(),
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: img,
            author: item.creator || 'Motorsport Brasil',
            categories: item.categories || ['F1']
          });
        }
      });
    });

    // Limpeza Global
    globalResults.forEach(feed => {
      if (!feed) return;
      feed.items.forEach(item => {
        if (!globalTitles.has(item.title)) {
          globalTitles.add(item.title);
          
          let img = item.enclosure?.url || '';
          if (!img && item['media:content']) img = item['media:content']['$']?.url || '';
          if (!img) img = 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1968&auto=format&fit=crop'; // Fallback Internacional

          globalNews.push({
            id: item.guid || Math.random().toString(),
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: img,
            author: item.creator || 'Global Motorsport',
            categories: item.categories || ['F1']
          });
        }
      });
    });

    // Ordenação e Limite
    brNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    globalNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    brNews = brNews.slice(0, 20);
    globalNews = globalNews.slice(0, 20);

    return NextResponse.json({
      success: true,
      data: {
        brasil: brNews,
        global: globalNews
      }
    });

  } catch (error) {
    console.error("News Pipeline Error:", error);
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
  }
}
