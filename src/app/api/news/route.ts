import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

export const revalidate = 900; // 15 min cache
export const dynamic = 'force-dynamic';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  url: string;
  image_url: string;
  category: string;
  tipo: 'br';
  published_at: string;
  abstract: string;
}

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['source', 'gnSource'],
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// ═══════════════════════════════════════════════════════
// FEEDS — 100% Google News RSS
// Google já possui acordos com os portais.
// Nós indexamos o que o Google já indexou.
// ═══════════════════════════════════════════════════════
const FEEDS = [
  // ── Fórmula 1 ──
  { url: 'https://news.google.com/rss/search?q=Formula+1+GP&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'F1' },
  { url: 'https://news.google.com/rss/search?q=F1+2026+piloto+equipe&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'F1' },

  // ── MotoGP ──
  { url: 'https://news.google.com/rss/search?q=MotoGP+corrida+2026&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'MotoGP' },
  { url: 'https://news.google.com/rss/search?q=MotoGP+Bagnaia+Marquez&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'MotoGP' },

  // ── Stock Car Brasil ──
  { url: 'https://news.google.com/rss/search?q=Stock+Car+Brasil+etapa&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Stock Car' },
  { url: 'https://news.google.com/rss/search?q=%22Stock+Car%22+corrida+resultado&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Stock Car' },

  // ── WEC / Endurance ──
  { url: 'https://news.google.com/rss/search?q=WEC+Le+Mans+Hypercar&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'WEC' },
  { url: 'https://news.google.com/rss/search?q=24+Horas+Le+Mans+2026&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'WEC' },

  // ── NASCAR ──
  { url: 'https://news.google.com/rss/search?q=NASCAR+Cup+corrida+resultado&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'NASCAR' },

  // ── WRC / Rally ──
  { url: 'https://news.google.com/rss/search?q=WRC+rally+2026+etapa&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'WRC' },

  // ── Categorias Nacionais ──
  { url: 'https://news.google.com/rss/search?q=Porsche+Cup+Brasil+2026&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Nacionais' },
  { url: 'https://news.google.com/rss/search?q=Copa+Truck+Brasil+etapa&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Nacionais' },
  { url: 'https://news.google.com/rss/search?q=Formula+4+Brasil+piloto&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Nacionais' },
  { url: 'https://news.google.com/rss/search?q=Copa+HB20+automobilismo&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Nacionais' },
  { url: 'https://news.google.com/rss/search?q=automobilismo+Brasil+corrida&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Nacionais' },

  // ── IndyCar ──
  { url: 'https://news.google.com/rss/search?q=IndyCar+2026+corrida&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Geral' },

  // ── FIA ──
  { url: 'https://news.google.com/rss/search?q=FIA+Formula+1+regulamento&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'F1' },

  // ── Formula E ──
  { url: 'https://news.google.com/rss/search?q=Formula+E+2026+corrida&hl=pt-BR&gl=BR&ceid=BR:pt-419', cat: 'Geral' },
];

// ═══════════════════════════════════════════════════════
// EXTRAÇÕES — nome do portal, URL, título limpo, imagem
// ═══════════════════════════════════════════════════════

function extractSourceName(item: any): string {
  if (item.gnSource) {
    if (typeof item.gnSource === 'string') return item.gnSource;
    if (item.gnSource['_']) return item.gnSource['_'];
  }
  if (item.title) {
    const match = item.title.match(/\s[-–—]\s([^-–—]+)$/);
    if (match) return match[1].trim();
  }
  return 'Fonte de Automobilismo';
}

function extractSourceUrl(item: any): string {
  try {
    if (item.link) return new URL(item.link).hostname.replace('www.', '');
  } catch {}
  return '';
}

function cleanTitle(raw: string): string {
  if (!raw) return '';
  return raw.replace(/\s[-–—]\s[^-–—]+$/, '').trim();
}

function extractImage(item: any): string {
  if (item.enclosure?.url && item.enclosure.url.startsWith('http')) return item.enclosure.url;

  const mc = item['media:content'];
  if (mc) {
    const url = mc?.['$']?.url || (Array.isArray(mc) && mc[0]?.['$']?.url);
    if (url && url.startsWith('http')) return url;
  }

  const mt = item['media:thumbnail'];
  if (mt) {
    const url = mt?.['$']?.url || (typeof mt === 'string' && mt.startsWith('http') ? mt : null);
    if (url) return url;
  }

  return '/images/news-placeholder.png';
}

// ═══════════════════════════════════════════════════════
// FETCH E PROCESSA
// ═══════════════════════════════════════════════════════

async function fetchAllFeeds(): Promise<NewsItem[]> {
  const promises = FEEDS.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items.map((item) => ({
        id: item.guid || item.link || Math.random().toString(36),
        title: cleanTitle(item.title || ''),
        source: extractSourceName(item),
        sourceUrl: extractSourceUrl(item),
        url: item.link || '',
        image_url: extractImage(item),
        category: feed.cat,
        tipo: 'br' as const,
        published_at: item.pubDate || item.isoDate || new Date().toISOString(),
        abstract: '', // Vazio de propósito — não reproduzimos texto de terceiros
      }));
    } catch (err) {
      console.warn(`[News] Feed falhou: ${feed.cat}`, (err as Error).message);
      return [];
    }
  });

  const results = await Promise.all(promises);
  let all: NewsItem[] = results.flat();

  // Filtra sem título ou URL
  all = all.filter(n => n.title.length > 10 && n.url.length > 5);

  // Deduplicação por URL e título
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  all = all.filter(n => {
    const url = n.url.split('?')[0].toLowerCase();
    const title = n.title.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúüç\s]/g, '').trim().substring(0, 60);
    if (seenUrls.has(url) || seenTitles.has(title)) return false;
    seenUrls.add(url);
    seenTitles.add(title);
    return true;
  });

  // Ordena por data
  all.sort((a, b) => {
    const da = new Date(a.published_at).getTime() || 0;
    const db = new Date(b.published_at).getTime() || 0;
    return db - da;
  });

  return all.slice(0, 150);
}

// ═══════════════════════════════════════════════════════
// GET HANDLER
// ═══════════════════════════════════════════════════════

export async function GET() {
  try {
    const news = await fetchAllFeeds();

    const catCounts: Record<string, number> = {};
    news.forEach(n => { catCounts[n.category] = (catCounts[n.category] || 0) + 1; });

    return NextResponse.json({
      success: true,
      total: news.length,
      sources: [...new Set(news.map(n => n.source))],
      categories: catCounts,
      data: { brasil: news, global: [] }
    });
  } catch (error) {
    console.error('[API News] Erro:', error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}
