const feeds = [
// ── PR WIRE (reprodução explicitamente permitida) ──
{ url: 'https://www.prnewswire.com/rss/news-releases-list.rss?category=SPT', nome: 'PRNewswire', tipo: 'pr_wire' },
{ url: 'https://www.businesswire.com/rss/home/?rss=g7', nome: 'BusinessWire', tipo: 'pr_wire' },
{ url: 'https://www.globenewswire.com/RssFeed/subjectcode/24-Sports', nome: 'GlobeNewswire', tipo: 'pr_wire' },
// ── FIA (cobre F1, WEC, WRC, Formula E, Karting) ──
{ url: 'https://www.fia.com/news/feed', nome: 'FIA News', tipo: 'oficial_strict' },
{ url: 'https://www.fia.com/press-releases/feed', nome: 'FIA Press Releases', tipo: 'oficial_strict' },
// ── INTERNACIONAIS OFICIAIS ──
{ url: 'https://www.motogp.com/en/news/feed', nome: 'MotoGP', tipo: 'oficial_strict' },
{ url: 'https://www.nascar.com/rss/news.rss', nome: 'NASCAR', tipo: 'oficial_strict' },
{ url: 'https://www.fiawec.com/en/news/feed', nome: 'FIA WEC', tipo: 'oficial_strict' },
{ url: 'https://www.fiawec.com/en/feed', nome: 'FIA WEC (2)', tipo: 'oficial_strict' },
{ url: 'https://www.wrc.com/en/news/feed', nome: 'WRC (1)', tipo: 'oficial_strict' },
{ url: 'https://www.wrc.com/en/wrc/news/feed', nome: 'WRC (2)', tipo: 'oficial_strict' },
{ url: 'https://www.fiaformulae.com/en/news/feed', nome: 'Formula E (1)', tipo: 'oficial_strict' },
{ url: 'https://www.fiaformulae.com/rss', nome: 'Formula E (2)', tipo: 'oficial_strict' },
{ url: 'https://www.indycar.com/api/news/rss', nome: 'IndyCar (1)', tipo: 'oficial_strict' },
{ url: 'https://www.indycar.com/rss/news', nome: 'IndyCar (2)', tipo: 'oficial_strict' },
{ url: 'https://motorsport.porsche.com/bra/pt/cup/news/feed', nome: 'Porsche Cup BR (1)', tipo: 'oficial_strict' },
{ url: 'https://www.porsche.com/brazil/motorsport/news/feed', nome: 'Porsche Cup BR (2)', tipo: 'oficial_strict' },
// ── BRASILEIROS PRINCIPAIS ──
{ url: 'https://www.stockcar.com.br/feed', nome: 'Stock Car BR (1)', tipo: 'oficial_news' },
{ url: 'https://www.stockcar.com.br/noticias/feed', nome: 'Stock Car BR (2)', tipo: 'oficial_news' },
{ url: 'https://formula4brasil.com.br/feed', nome: 'F4 Brasil (1)', tipo: 'oficial_news' },
{ url: 'https://formula4brasil.com.br/noticias/feed',nome: 'F4 Brasil (2)', tipo: 'oficial_news' },
{ url: 'https://www.copatruck.com.br/feed', nome: 'Copa Truck (1)', tipo: 'oficial_news' },
{ url: 'https://www.copatruck.com.br/noticias/feed', nome: 'Copa Truck (2)', tipo: 'oficial_news' },
{ url: 'https://www.gtsprintrace.com.br/feed', nome: 'GT Sprint Race (1)', tipo: 'oficial_news' },
{ url: 'https://gtsprintrace.com.br/noticias/feed', nome: 'GT Sprint Race (2)', tipo: 'oficial_news' },
{ url: 'https://www.turismonacional.com.br/feed', nome: 'Turismo Nacional', tipo: 'oficial_news' },
{ url: 'https://www.cbat.org.br/feed', nome: 'CBAT', tipo: 'oficial_news' },
// ── BRASILEIROS SECUNDÁRIOS ──
{ url: 'https://tcrbrasil.com.br/feed', nome: 'TCR Brasil', tipo: 'oficial_news' },
{ url: 'https://endurancebrasil.com.br/feed', nome: 'Endurance Brasil', tipo: 'oficial_news' },
{ url: 'https://www.formulavee.com.br/feed', nome: 'Formula Vee', tipo: 'oficial_news' },
{ url: 'https://www.copahb20.com.br/feed', nome: 'Copa HB20', tipo: 'oficial_news' },
{ url: 'https://www.copademarcas.com.br/feed', nome: 'Copa de Marcas', tipo: 'oficial_news' },
{ url: 'https://www.moto1000gp.com.br/feed', nome: 'Moto 1000 GP (1)', tipo: 'oficial_news' },
{ url: 'https://moto1000gp.com.br/noticias/feed', nome: 'Moto 1000 GP (2)', tipo: 'oficial_news' },
{ url: 'https://www.superbikebrasil.com.br/feed', nome: 'Super Bike BR (1)', tipo: 'oficial_news' },
{ url: 'https://superbikebrasil.com.br/noticias/feed',nome: 'Super Bike BR (2)', tipo: 'oficial_news' }
];

(async () => {
console.log('\n=== VERIFICAÇÃO COMPLETA DE FEEDS ===\n');
const ativos = [];
for (const f of feeds) {
try {
const r = await fetch(f.url, {
headers: { 'User-Agent': 'Driver News-News-Bot/1.0 (+https://drivernews.com.br/bot)' },
signal: AbortSignal.timeout(9000),
});
const txt = await r.text();
const ok = txt.includes('<rss') || txt.includes('<feed') || txt.includes('<channel');
console.log(`${r.status} | ${ok ? 'RSS ATIVO' : ' SEM RSS '} | [${f.tipo}] ${f.nome}`);
console.log(`  ${f.url}\n`);
if (ok) ativos.push(f);
} catch {
console.log(`000 | TIMEOUT | [${f.tipo}] ${f.nome}`);
console.log(`  ${f.url}\n`);
}
}
console.log('\n=== FEEDS ATIVOS — cole no route.ts ===');
ativos.forEach(f => console.log(`  [${f.tipo}] ${f.nome}`));
console.log(`\nTotal: ${ativos.length} feeds ativos de ${feeds.length} testados`);
})();
