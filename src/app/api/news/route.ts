import Parser from 'rss-parser';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 259200; // 72 horas
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ═══════════════════════════════════════════════════════
// TIPOS DE FEED
//
// pr_wire        → PRNewswire / BusinessWire / GlobeNewswire
//                  Reprodução explicitamente permitida pelos T&C
//                  Aceita imagem de qualquer campo RSS
//
// oficial_strict → FIA, MotoGP, NASCAR, WEC, WRC, IndyCar, Porsche Cup, Formula E
//                  Press release oficial — somente imagem de campos media explícitos
//                  (enclosure, media:content, media:thumbnail)
//                  Sem HTML scraping de imagem
//
// oficial_news   → Séries brasileiras (Stock Car, F4, Copa Truck, GT Sprint, etc.)
//                  PT-BR nativo · sem tradução
//                  Aceita imagem de campos explícitos (sem HTML scraping)
// ═══════════════════════════════════════════════════════

type FeedTipo = 'pr_wire' | 'oficial_strict' | 'oficial_news';

interface Fonte {
  url: string;
  name: string;
  category: string;
  lang: 'pt' | 'en' | 'es' | 'fr';
  tipo: FeedTipo;
  keywords: string[]; // [] = aceita tudo; use para pr_wire
}

export interface NewsItem {
  id: string;
  title: string;          // PT-BR — reescrito pela IA    
  original_title: string; // original — para log
  source: string;         // "FIA", "Stock Car Brasil"
  source_url: string;     // URL do press release
  image_url: string;      // imagem do press release
  image_source: string;   // campo de onde veio a imagem 
  category: string;
  tipo: FeedTipo;
  published_at: string;
  excerpt: string;        // resumo PT-BR ≤ 280 chars
  was_translated: boolean;
  original_lang: string;
}

// ═══════════════════════════════════════════════════════
// FONTES
// ═══════════════════════════════════════════════════════
const FONTES: Fonte[] = [
  // ── PR WIRE — REPRODUÇÃO EXPLICITAMENTE PERMITIDA ──
  {
    url: 'https://www.prnewswire.com/rss/news-releases-list.rss?category=SPT',
    name: 'PRNewswire', category: 'Geral', lang: 'en', tipo: 'pr_wire',
    keywords: ['formula 1','f1','nascar','motogp','moto gp','wec','le mans','indycar','rally','motorsport','racing','porsche cup','stock car','endurance','superbike','formula e'],
  },
  {
    url: 'https://www.businesswire.com/rss/home/?rss=g7',
    name: 'BusinessWire', category: 'Geral', lang: 'en', tipo: 'pr_wire',
    keywords: ['formula 1','f1','nascar','motogp','racing','motorsport','wec','indycar'],
  },
  {
    url: 'https://www.globenewswire.com/RssFeed/subjectcode/24-Sports',
    name: 'GlobeNewswire', category: 'Geral', lang: 'en', tipo: 'pr_wire',
    keywords: ['formula','nascar','motogp','racing','motorsport','wec','rally','indycar'],
  },
  // ── OFICIAL STRICT — PRESS RELEASES INTERNACIONAIS ──
  { url: 'https://www.fia.com/news/feed', name: 'FIA', category: 'F1', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://www.motogp.com/en/news/feed', name: 'MotoGP', category: 'MotoGP', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://www.nascar.com/rss/news.rss', name: 'NASCAR', category: 'NASCAR', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://www.fiawec.com/en/news/feed', name: 'FIA WEC', category: 'WEC', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://www.wrc.com/en/news/feed', name: 'WRC', category: 'WRC', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://www.fiaformulae.com/en/news/feed', name: 'Formula E', category: 'F1', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://www.indycar.com/api/news/rss', name: 'IndyCar', category: 'Geral', lang: 'en', tipo: 'oficial_strict', keywords: [] },
  { url: 'https://motorsport.porsche.com/bra/pt/cup/news/feed', name: 'Porsche Cup Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_strict', keywords: [] },
  // ── OFICIAL NEWS — SÉRIES BRASILEIRAS PT-BR ──
  { url: 'https://www.stockcar.com.br/feed', name: 'Stock Car Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://formula4brasil.com.br/feed', name: 'F4 Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.copatruck.com.br/feed', name: 'Copa Truck Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.gtsprintrace.com.br/feed', name: 'GT Sprint Race', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.turismonacional.com.br/feed', name: 'Turismo Nacional', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.cbat.org.br/feed', name: 'CBAT', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://tcrbrasil.com.br/feed', name: 'TCR Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://endurancebrasil.com.br/feed', name: 'Endurance Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.formulavee.com.br/feed', name: 'Formula Vee', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.copahb20.com.br/feed', name: 'Copa HB20', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.copademarcas.com.br/feed', name: 'Copa de Marcas', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.moto1000gp.com.br/feed', name: 'Moto 1000 GP', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] },
  { url: 'https://www.superbikebrasil.com.br/feed', name: 'Super Bike Brasil', category: 'Geral', lang: 'pt', tipo: 'oficial_news', keywords: [] }
];

// ═══════════════════════════════════════════════════════
// PARSER RSS
// ═══════════════════════════════════════════════════════
const parser = new Parser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Driver News-News-Bot/1.0 (+https://drivernews.com.br/bot)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

function extrairImagem(item: any, tipo: FeedTipo): { url: string; source: string } | null {
  if (item.enclosure?.url && item.enclosure.url.startsWith('http')) return { url: item.enclosure.url, source: 'enclosure' };
  
  const mc = item['media:content'];
  if (mc) {
    const url = mc?.['$']?.url || (Array.isArray(mc) && mc[0]?.['$']?.url);
    if (url && url.startsWith('http')) return { url, source: 'media_content' };
  }
  
  const mt = item['media:thumbnail'];
  if (mt) {
    const url = mt?.['$']?.url || (typeof mt === 'string' && mt.startsWith('http') ? mt : null);
    if (url) return { url, source: 'media_thumbnail' };
  }
  
  if (tipo === 'pr_wire') {
    const html = item.contentEncoded || item.content || '';
    if (html) {
      const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m?.[1]?.startsWith('http')) return { url: m[1], source: 'html_content' };
    }
  }
  return null;
}

const EXCERPT_LIMIT: Record<FeedTipo, number> = {
  pr_wire: 280,
  oficial_strict: 200,
  oficial_news: 240,
};

function extrairExcerpt(item: any, tipo: FeedTipo): string {
  const limit = EXCERPT_LIMIT[tipo];
  const html = item.contentEncoded || item.content || '';
  if (html) {
    return html.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().substring(0, limit);
  }
  return (item.contentSnippet || item.summary || '').trim().substring(0, limit);
}

function classificarCategoria(item: any, catFeed: string): string {
  if (catFeed !== 'Geral') return catFeed;
  const t = `${item.title || ''} ${item.contentSnippet || ''} ${item.link || ''}`.toLowerCase();
  
  if (t.includes('motogp') || t.includes('moto gp') || t.includes('moto2') || t.includes('superbike')) return 'MotoGP';
  if (t.includes('stock car') || t.includes('porsche cup') || t.includes('f4 brasil') || t.includes('sprint race')) return 'Nacionais';
  if (t.includes('wec') || t.includes('le mans') || t.includes('endurance') || t.includes('hypercar')) return 'WEC';
  if (t.includes('nascar') || t.includes('cup series') || t.includes('xfinity')) return 'NASCAR';
  if (t.includes('wrc') || t.includes('rally') || t.includes('rallycross')) return 'WRC';
  if (t.includes('indycar') || t.includes('indy 500') || t.includes('indianapolis')) return 'Geral';
  if (t.includes('formula 1') || t.includes('formula one') || t.includes(' f1 ') || t.includes('formula e')) return 'F1';
  return 'Geral';
}

function passaFiltro(item: any, keywords: string[]): boolean {
  if (!keywords.length) return true;
  const t = `${item.title || ''} ${item.contentSnippet || ''} ${item.link || ''}`.toLowerCase();
  return keywords.some(k => t.includes(k.toLowerCase()));
}

async function processarComIA(itens: Array<{ title: string; excerpt: string; lang: string; tipo: FeedTipo }>): Promise<Array<{ title: string; excerpt: string }>> {
  if (!itens.length) return [];
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return itens.map(i => ({ title: i.title, excerpt: i.excerpt }));
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Você é editor-chefe do Driver News, portal de automobilismo.
Para cada item do array faça:
1. Se lang != "pt": TRADUZA título e excerpt para português brasileiro fluente
2. REESCREVA o título em estilo jornalístico direto (máx 85 chars)
3. Mantenha fatos exatos.
4. O excerpt deve ser resumo PT-BR c/ máx 260 chars. NUNCA invente info.
Retorne SOMENTE array JSON com {"title":"","excerpt":""} na ordem exata.
Input: ${JSON.stringify(itens.map(i => ({ title: i.title, excerpt: i.excerpt, lang: i.lang })))}`;
    
    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === itens.length) return parsed;
    throw new Error('Array len mismatch');
  } catch (err) {
    return itens.map(i => ({ title: i.title, excerpt: i.excerpt }));
  }
}

async function salvarLogs(items: NewsItem[]): Promise<void> {
  try {
    const rows = items.map(n => ({
      feed_url: n.source_url, feed_tipo: n.tipo, source_name: n.source, category: n.category,
      item_guid: n.id, original_title: n.original_title, pt_title: n.title, original_lang: n.original_lang,
      was_translated: n.was_translated, item_url: n.source_url, image_url: n.image_url, image_source: n.image_source,
      excerpt_pt: n.excerpt, published_at: n.published_at,
    }));
    const { error } = await supabase.from('press_release_logs').upsert(rows, { onConflict: 'item_guid', ignoreDuplicates: true });
  } catch (err) {}
}

async function fetchPressReleases(): Promise<NewsItem[]> {
  const promises = FONTES.map(async (fonte) => {
    try {
      const feed = await parser.parseURL(fonte.url);
      return feed.items.filter(item => passaFiltro(item, fonte.keywords)).map(item => {
        const img = extrairImagem(item, fonte.tipo);
        return { item, fonte, img };
      }).filter(({ img }) => img !== null);
    } catch { return []; }
  });
  
  const resultados = await Promise.all(promises);
  const todos = resultados.flat() as Array<{ item: any; fonte: Fonte; img: { url: string; source: string } }>;
  
  const seenUrls = new Set<string>();
  const unicos = todos.filter(({ item }) => {
    const url = (item.link || item.guid || '').split('?')[0].toLowerCase();
    if (!url || seenUrls.has(url)) return false;
    seenUrls.add(url);
    return true;
  });
  
  const processados = await processarComIA(unicos.map(({ item, fonte }) => ({
    title: (item.title || '').trim(), excerpt: extrairExcerpt(item, fonte.tipo), lang: fonte.lang, tipo: fonte.tipo,
  })));
  
  const newsItems: NewsItem[] = unicos.map(({ item, fonte, img }, i) => {
    const proc = processados[i];
    const category = classificarCategoria(item, fonte.category);
    return {
      id: (item.guid || item.link || `${fonte.name}-${i}`).substring(0, 200),
      title: proc.title || (item.title || '').trim(), original_title: (item.title || '').trim(),
      source: fonte.name, source_url: item.link || '', image_url: img!.url, image_source: img!.source,
      category, tipo: fonte.tipo, published_at: item.pubDate || item.isoDate || new Date().toISOString(),
      excerpt: proc.excerpt || '', was_translated: fonte.lang !== 'pt', original_lang: fonte.lang,
    };
  });
  
  newsItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  salvarLogs(newsItems).catch(() => {});
  return newsItems.slice(0, 100);
}

export async function GET() {
  try {
    const news = await fetchPressReleases();
    const cats: Record<string, number> = {};
    const sources = new Set<string>();
    news.forEach(n => { cats[n.category] = (cats[n.category] || 0) + 1; sources.add(n.source); });
    
    return NextResponse.json({
      success: true, total: news.length, sources: [...sources], categories: cats,
      model: 'press_release_v2', cache_h: 72, data: { brasil: news, global: [] },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
