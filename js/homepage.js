/* =====================================================
   PITLANE NEWS — HOMEPAGE JS
   ===================================================== */

/* ====== DATA ====== */
const ARTICLES = [
  {
    id:0, cat:'f1', badge:'f1', kicker:'BREAKING NEWS',
    title:'Verstappen Conquista Pole em Miami sob Chuva Torrencial',
    author:'Carlos Biasi', av:'CB', date:'10 Abr 2026 · 5 min de leitura',
    img:'https://loremflickr.com/760/320/formula1,car?lock=3',
    body:`<p>Max Verstappen mostrou mais uma vez por que é o melhor piloto do mundo em condições adversas. No sábado à tarde no Miami International Autodrome, com chuva intensa e temperatura de 28°C, o holandês da Red Bull Racing cravou uma volta de 1:26.543, superando Lando Norris por apenas 43 milésimos de segundo.</p>
    <h3>A Volta Perfeita</h3>
    <p>Verstappen utilizou pneus intermediários durante toda a sessão de classificação e entrou na pista pela última vez faltando apenas 4 minutos para o fim, quando a pista estava em condições ideais.</p>
    <blockquote><p>"A chuva sempre foi minha aliada. Quando o carro escorrega, você precisa confiar nos instintos." — Max Verstappen</p></blockquote>
    <h3>O que Esperar da Corrida</h3>
    <p>Com a pole garantida, Verstappen parte como favorito para a corrida de domingo. A corrida acontece neste domingo, 13 de abril, às 16h (horário de Brasília).</p>`
  },
  {
    id:1, cat:'motogp', badge:'motogp', kicker:'MOTOGP · RACE RESULT',
    title:'Bagnaia Vence GP da França — Márquez Abandona com Queda',
    author:'Ana Rocha', av:'AR', date:'9 Abr 2026 · 4 min de leitura',
    img:'https://loremflickr.com/760/320/motorcycle,racing?lock=7',
    body:`<p>Francesco Bagnaia conquistou mais uma vitória dominante no GP da França, em Le Mans, em uma prova marcada pelo abandono de Marc Márquez na 18ª volta.</p>
    <h3>Bagnaia Implacável</h3>
    <p>Pecco cruzou a linha em primeiro com 4.2 segundos de vantagem para Jorge Martin, que completou o pódio ao lado de Aleix Espargaró.</p>
    <blockquote><p>"A moto estava perfeita hoje." — Francesco Bagnaia</p></blockquote>`
  },
  {
    id:2, cat:'sim', badge:'sim', kicker:'SIM RACING · ESPECIAL',
    title:'PitLane Ranking — Os 50 Pilotos Virtuais Mais Rápidos do Brasil',
    author:'Redação', av:'PL', date:'10 Abr 2026 · 8 min de leitura',
    img:'https://loremflickr.com/760/320/simracing,gaming?lock=5',
    body:`<p>Analisamos dados de mais de 3.200 pilotos registrados nas principais plataformas — iRacing, ACC e rFactor 2 — para montar o ranking definitivo.</p>
    <h3>Os Favoritos</h3>
    <p>O paulista Rafael "Turbo" Mendes lidera a lista com uma média de consistência de 98.2%.</p>`
  },
  {
    id:3, cat:'wec', badge:'wec', kicker:'WEC · LE MANS',
    title:'24h de Le Mans 2026: Guia Completo de Categorias e Favoritos',
    author:'Pedro Neto', av:'PN', date:'8 Abr 2026 · 12 min de leitura',
    img:'https://loremflickr.com/760/320/lemans,night?lock=12',
    body:`<p>A corrida mais longa e mais famosa do automobilismo mundial acontece em 13 e 14 de junho de 2026. Grid recorde de 62 carros.</p>
    <h3>Hypercar: A Briga pelo Topo</h3>
    <p>Toyota, Ferrari, Porsche, BMW e Cadillac entre os favoritos.</p>`
  },
  {
    id:4, cat:'f1', badge:'f1', kicker:'EDITORIAL',
    title:'A Fórmula 1 Está Destruindo o que a Tornou Especial com o Excesso de Sprints',
    author:'Rafael Freitas', av:'RF', date:'7 Abr 2026 · 6 min de leitura',
    img:'https://loremflickr.com/760/320/formula1,race?lock=30',
    body:`<p>Com sete corridas sprint no calendário de 2026, chegou a hora de fazer uma pergunta difícil: estamos destruindo o que tornou a Fórmula 1 especial?</p>
    <blockquote><p>"Nenhuma corrida de sprint jamais ficou na memória da história do esporte." — Rafael Freitas</p></blockquote>`
  },
  {
    id:5, cat:'sim', badge:'sim', kicker:'COLUNA',
    title:'Sim Racing Não é Mais Hobby — é Categoria Oficial de Automobilismo',
    author:'Marina Vasconcelos', av:'MV', date:'6 Abr 2026 · 5 min de leitura',
    img:'https://loremflickr.com/760/320/esports,gaming?lock=55',
    body:`<p>Com a NASCAR patrocinando campeonatos digitais com prêmio de R$ 2 milhões e pilotos como Lando Norris competindo em ligas virtuais, não há como ignorar.</p>`
  }
];

const VIDEOS_DATA = [
  {title:'Onboard Completo: a Volta que Valeu a Pole de Verstappen em Miami', badge:'f1', dur:'18:32', views:'312K VIEWS · 10 ABR 2026', img:'https://loremflickr.com/800/400/formula1,cockpit?lock=22'},
  {title:'Setup ACC em Monza — Ganhe 1.5s por Volta', badge:'sim', dur:'22:10', views:'87K VIEWS · 8 ABR', img:'https://loremflickr.com/400/280/simracing,wheel?lock=55'},
  {title:'Análise Técnica: Aerodinâmica dos Hypercar de Le Mans', badge:'wec', dur:'31:44', views:'54K VIEWS · 7 ABR', img:'https://loremflickr.com/400/280/lemans,hypercar?lock=18'},
];

const DRIVERS = [
  {pos:1,cls:'p1',flag:'🇳🇱',name:'Verstappen',team:'Oracle Red Bull Racing',pts:94,pct:100,color:'var(--acc)'},
  {pos:2,cls:'p2',flag:'🇬🇧',name:'Norris',team:'McLaren F1 Team',pts:78,pct:83,color:'#ff8000'},
  {pos:3,cls:'p3',flag:'🇲🇽',name:'Pérez',team:'Oracle Red Bull Racing',pts:64,pct:68,color:'var(--acc)'},
  {pos:4,cls:'',flag:'🇪🇸',name:'Sainz',team:'Williams Racing',pts:57,pct:61,color:'#005aff'},
  {pos:5,cls:'',flag:'🇬🇧',name:'Russell',team:'Mercedes-AMG Petronas',pts:50,pct:53,color:'#00d2be'},
  {pos:6,cls:'',flag:'🇲🇨',name:'Leclerc',team:'Scuderia Ferrari',pts:43,pct:46,color:'#dc0000'},
  {pos:7,cls:'',flag:'🇦🇺',name:'Piastri',team:'McLaren F1 Team',pts:37,pct:39,color:'#ff8000'},
  {pos:8,cls:'',flag:'🇩🇪',name:'Hamilton',team:'Scuderia Ferrari',pts:32,pct:34,color:'#dc0000'},
];

const CONSTRUCTORS = [
  {pos:1,cls:'p1',flag:'🏴',name:'Red Bull Racing',team:'Oracle · Honda RBPT',pts:158,pct:100,color:'var(--acc)'},
  {pos:2,cls:'p2',flag:'🏴',name:'McLaren',team:'Mercedes Power Unit',pts:115,pct:73,color:'#ff8000'},
  {pos:3,cls:'p3',flag:'🏴',name:'Ferrari',team:'Scuderia Ferrari',pts:75,pct:47,color:'#dc0000'},
  {pos:4,cls:'',flag:'🏴',name:'Mercedes',team:'Mercedes-AMG Petronas',pts:68,pct:43,color:'#00d2be'},
  {pos:5,cls:'',flag:'🏴',name:'Williams',team:'Williams Racing · Mercedes',pts:57,pct:36,color:'#005aff'},
  {pos:6,cls:'',flag:'🏴',name:'Aston Martin',team:'Aramco · Honda',pts:34,pct:21,color:'#006f62'},
];

/* ====== RENDER STANDINGS ====== */
let currentTab = 'drivers';
function renderStandings(data) {
  const t = document.getElementById('standingsTable');
  if(!t) return;
  t.innerHTML = '<tbody>' + data.map(r=>`
    <tr onclick="showToast('${r.name} — ${r.pts} pontos · ${r.team}')">
      <td class="s-pos ${r.cls}">${r.pos}</td>
      <td class="s-flag">${r.flag}</td>
      <td><div class="s-name">${r.name}</div><div class="s-team">${r.team}</div></td>
      <td class="s-bar-c"><div class="s-bar-bg"><div class="s-bar" style="width:${r.pct}%;background:${r.color}"></div></div></td>
      <td class="s-pts">${r.pts}</td>
    </tr>`).join('') + '</tbody>';
}
function switchTab(el, tab) {
  document.querySelectorAll('.s-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  currentTab = tab;
  renderStandings(tab === 'drivers' ? DRIVERS : CONSTRUCTORS);
}

/* ====== COUNTDOWN ====== */
function initCountdown() {
  const raceDate = new Date('2026-04-13T20:00:00Z');
  function tick() {
    const d = raceDate - new Date();
    if(d <= 0){ const cg = document.querySelector('.countdown-grid'); if(cg) cg.innerHTML = '<div style="grid-column:span 4;text-align:center;padding:18px;font-family:var(--fm);font-size:12px;color:var(--acc)"><i data-lucide="flag" style="width:16px;height:16px;display:inline-block;vertical-align:text-bottom"></i> CORRIDA EM ANDAMENTO</div>'; return; }
    const el = (id,v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    el('cd-days', String(Math.floor(d/86400000)).padStart(2,'0'));
    el('cd-hours', String(Math.floor((d%86400000)/3600000)).padStart(2,'0'));
    el('cd-mins', String(Math.floor((d%3600000)/60000)).padStart(2,'0'));
    el('cd-secs', String(Math.floor((d%60000)/1000)).padStart(2,'0'));
  }
  tick(); setInterval(tick, 1000);
}

/* ====== SEARCH ====== */
function openSearch() {
  openModal('searchOverlay');
  setTimeout(()=>{ const si = document.getElementById('searchInput'); if(si) si.focus(); }, 80);
  renderSearchResults('');
}
function closeSearch() { closeModal('searchOverlay'); }
function searchByTag(tag) {
  const si = document.getElementById('searchInput');
  if(si) { si.value = tag; renderSearchResults(tag); }
}
function renderSearchResults(q) {
  const wrap = document.getElementById('searchResultsWrap');
  if(!wrap) return;
  if(!q.trim()){ wrap.innerHTML=''; return; }
  const results = ARTICLES.filter(a=>
    a.title.toLowerCase().includes(q.toLowerCase()) ||
    a.cat.toLowerCase().includes(q.toLowerCase()) ||
    (a.author||'').toLowerCase().includes(q.toLowerCase())
  );
  if(!results.length){ wrap.innerHTML='<div class="search-empty">Nenhum resultado para "'+q+'"</div>'; return; }
  wrap.innerHTML = results.map(a=>`
    <div class="search-result" onclick="closeSearch();openArticleById(${a.id})">
      <img class="sr-img" src="${a.img}" alt="">
      <div>
        <div class="sr-title">${a.title}</div>
        <div class="sr-meta">${a.author} · ${a.date}</div>
      </div>
    </div>`).join('');
}

/* ====== SUBSCRIBE MODAL ====== */
function openSubscribeModal() { openModal('subOverlay'); setSubStep(1); }
function setSubStep(n) {
  document.querySelectorAll('.sub-step').forEach((s,i)=>s.classList.toggle('active',i+1===n));
  const fill = document.getElementById('subProgressFill');
  if(fill) fill.style.width = (n===3?100:n===2?66:33)+'%';
}
function subNext(step) {
  if(step===1) {
    const email = document.getElementById('subEmail')?.value;
    const err = document.getElementById('subEmailErr');
    const inp = document.getElementById('subEmail');
    if(!isValidEmail(email)) { inp?.classList.add('err'); err?.classList.add('show'); return; }
    inp?.classList.remove('err'); err?.classList.remove('show');
    setSubStep(2);
  } else {
    setSubStep(3);
    showToast('✓ Inscrição confirmada! Bem-vindo ao grid.','ok');
  }
}
function toggleCat(el) { el.classList.toggle('on'); }

/* ====== VIDEO MODAL ====== */
function openVideoModal(idx) {
  const v = VIDEOS_DATA[idx];
  if(!v) return;
  document.getElementById('vmThumb').src = v.img;
  document.getElementById('vmTitle').textContent = v.title;
  document.getElementById('vmMeta').textContent = v.dur + ' · ' + v.views;
  const badge = document.getElementById('vmBadge');
  badge.className = 'badge '+v.badge;
  badge.textContent = v.badge.toUpperCase();
  document.getElementById('videoPlaying')?.classList.remove('active');
  openModal('videoOverlay');
}
function startVideo() {
  document.getElementById('videoPlaying')?.classList.add('active');
  showToast('▶ Reproduzindo vídeo...','ok');
}

/* ====== ARTICLE MODAL ====== */
function openArticleById(id) {
  const a = ARTICLES.find(x=>x.id===id);
  if(!a) return;
  document.getElementById('articleBreadcrumb').textContent = 'PITLANE NEWS · '+a.cat.toUpperCase();
  document.getElementById('articleImg').src = a.img;
  const badge = document.getElementById('articleBadge');
  badge.className = 'badge '+a.badge;
  badge.textContent = a.badge.toUpperCase().replace('SIM','SIM RACING');
  document.getElementById('articleKicker').textContent = a.kicker;
  document.getElementById('articleTitle').textContent = a.title;
  document.getElementById('articleAv').textContent = a.av;
  document.getElementById('articleAuthor').textContent = a.author;
  document.getElementById('articleDate').textContent = a.date;
  document.getElementById('articleText').innerHTML = a.body;
  openModal('articleOverlay');
  document.getElementById('articleOverlay').scrollTop = 0;
}

/* ====== FILTER NEWS ====== */
let currentCat = 'all';
function filterCat(cat) {
  currentCat = cat;
  document.querySelectorAll('.ncard').forEach(c=>{
    const show = cat==='all' || c.dataset.cat===cat;
    c.classList.toggle('hidden',!show);
  });
  const title = document.getElementById('newsSectionTitle');
  if(title) title.textContent = cat==='all'?'Últimas Notícias':'Notícias: '+cat.toUpperCase();
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  document.querySelectorAll('.cat-pill').forEach(p=>{
    const onclick = p.getAttribute('onclick')||'';
    p.classList.toggle('active', onclick.includes("'"+cat+"'"));
  });
  if(cat!=='all') document.getElementById('newsSection')?.scrollIntoView({behavior:'smooth',block:'start'});
  else scrollToTop();
}
function filterTag(el, tag) {
  document.querySelectorAll('.ftag').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.ncard').forEach(c=>{
    const show = tag==='all' || c.dataset.cat===tag;
    c.classList.toggle('hidden',!show);
  });
}
function catActivate(el) {
  document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
}

/* ====== BOOKMARKS ====== */
let bookmarks = JSON.parse(localStorage.getItem('pl_bm')||'[]');
function toggleBookmark(btn, id) {
  if(bookmarks.includes(id)) { bookmarks = bookmarks.filter(x=>x!==id); btn.classList.remove('saved'); showToast('Removido dos salvos'); }
  else { bookmarks.push(id); btn.classList.add('saved'); showToast('✓ Artigo salvo!','ok'); }
  localStorage.setItem('pl_bm', JSON.stringify(bookmarks));
}

/* ====== NEWSLETTER ====== */
function submitNewsletter() {
  const input = document.getElementById('nlEmail');
  if(!isValidEmail(input?.value)) {
    input?.classList.add('err');
    if(input) input.style.animation='shake .4s ease';
    setTimeout(()=>{ if(input) input.style.animation=''; },400);
    showToast('⚠ Insira um e-mail válido','err'); return;
  }
  input?.classList.remove('err');
  const wrap = document.getElementById('nlFormWrap');
  if(wrap) wrap.innerHTML = `
    <div class="nl-success" style="text-align:center;padding:10px 0">
      <div style="font-size:28px;margin-bottom:4px">✓</div>
      <strong style="font-family:var(--fu);font-size:18px;letter-spacing:1px">Você está no grid!</strong>
      <p style="font-size:13px;color:var(--dim);margin-top:6px">Primeiro briefing amanhã antes das 8h.</p>
    </div>`;
  showToast('✓ Inscrição confirmada! Bem-vindo ao grid.','ok');
}

/* ====== INIT ====== */
document.addEventListener('DOMContentLoaded', ()=>{
  renderStandings(DRIVERS);
  initCountdown();
  // Search input listener
  const si = document.getElementById('searchInput');
  if(si) si.addEventListener('input', e=>renderSearchResults(e.target.value));
  // Restore bookmarks
  bookmarks.forEach(id=>{
    document.querySelector(`.ncard-bm[onclick*="toggleBookmark(this,${id})"]`)?.classList.add('saved');
  });
  // Animate news cards
  document.querySelectorAll('.ncard').forEach((c,i)=>{
    c.style.transitionDelay=(i*.07)+'s'; c.classList.add('reveal');
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
    },{threshold:0.07});
    obs.observe(c);
  });
});
