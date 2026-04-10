/* =====================================================
   PITLANE NEWS — HOMEPAGE JS (LIVE DATA)
   ===================================================== */

/* ====== INTERNAL ARTICLES DATA ====== */
let ARTICLES = []; // Will be populated dynamically

const VIDEOS_DATA = [
  {title:'Onboard Completo: a Volta que Valeu a Pole de Verstappen em Miami', badge:'f1', dur:'18:32', views:'312K VIEWS · 10 ABR 2026', img:'https://loremflickr.com/800/400/formula1,cockpit?lock=22'},
  {title:'Setup ACC em Monza — Ganhe 1.5s por Volta', badge:'sim', dur:'22:10', views:'87K VIEWS · 8 ABR', img:'https://loremflickr.com/400/280/simracing,wheel?lock=55'},
  {title:'Análise Técnica: Aerodinâmica dos Hypercar de Le Mans', badge:'wec', dur:'31:44', views:'54K VIEWS · 7 ABR', img:'https://loremflickr.com/400/280/lemans,hypercar?lock=18'},
];

let liveDrivers = [];
let liveConstructors = [];
let maxPoints = 0;

/* ====== DATA FETCHING (LIVE) ====== */
async function loadLiveStandings() {
  const [d, c] = await Promise.all([
     PitLane.Live.getDriverStandings(),
     PitLane.Live.getConstructorStandings()
  ]);
  
  if(d.length > 0) {
    maxPoints = Math.max(parseFloat(d[0].points), parseFloat(c[0]?.points || 0), 1);
    
    liveDrivers = d.map((r, i) => {
      const p = parseFloat(r.points);
      return {
        pos: r.position,
        cls: i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '',
        flag: '🏁', 
        name: r.Driver.familyName.toUpperCase(),
        team: r.Constructors[0]?.name || 'Privateer',
        pts: p,
        pct: (p / maxPoints) * 100,
        color: getConstructorColor(r.Constructors[0]?.constructorId)
      };
    });
  }
  
  if(c.length > 0) {
    liveConstructors = c.map((r, i) => {
      const p = parseFloat(r.points);
      return {
        pos: r.position,
        cls: i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '',
        flag: '🏎️', 
        name: r.Constructor.name.toUpperCase(),
        team: r.Constructor.nationality,
        pts: p,
        pct: (p / maxPoints) * 100,
        color: getConstructorColor(r.Constructor.constructorId)
      };
    });
  }

  // Initial render
  setTimeout(() => renderStandings(currentTab === 'drivers' ? liveDrivers : liveConstructors), 100);
}

function getConstructorColor(id) {
  const colors = {
    'red_bull': 'var(--acc)',
    'ferrari': '#dc0000',
    'mclaren': '#ff8000',
    'mercedes': '#00d2be',
    'aston_martin': '#006f62',
    'alpine': '#0090ff',
    'williams': '#005aff',
    'haas': '#ffffff',
    'rb': '#1f3cff',
    'sauber': '#00e701'
  };
  return colors[id] || '#666';
}

/* ====== RENDER STANDINGS ====== */
let currentTab = 'drivers';
function renderStandings(data) {
  const t = document.getElementById('standingsTable');
  if(!t) return;
  if(data.length === 0) {
    t.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--dim)">Carregando dados da F1 ao vivo...</td></tr>';
    return;
  }
  t.innerHTML = '<tbody>' + data.map(r=>`
    <tr onclick="showToast('${r.name} — ${r.pts} pontos · ${r.team}')">
      <td class="s-pos ${r.cls}">${r.pos}</td>
      <td class="s-flag">${r.flag}</td>
      <td><div class="s-name">${r.name}</div><div class="s-team">${r.team}</div></td>
      <td class="s-bar-c"><div class="s-bar-bg"><div class="s-bar" style="width:${r.pct}%;background:${r.color}"></div></div></td>
      <td class="s-pts">${r.pts}</td>
    </tr>`).join('') + '</tbody>';
    if(window.lucide) window.lucide.createIcons();
}

function switchTab(el, tab) {
  document.querySelectorAll('.s-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  currentTab = tab;
  renderStandings(tab === 'drivers' ? liveDrivers : liveConstructors);
}

/* ====== COUNTDOWN (LIVE) ====== */
async function initLiveCountdown() {
  const nextRace = await PitLane.Live.getNextRace();
  if(!nextRace) return;
  
  const rcName = document.getElementById('raceCardName');
  const rcTrack = document.getElementById('raceCardTrack');
  const rcDate = new Date(`${nextRace.date}T${nextRace.time}`);
  
  if(rcName) rcName.textContent = nextRace.raceName.toUpperCase();
  if(rcTrack) rcTrack.textContent = `${nextRace.Circuit.circuitName.toUpperCase()} · RONDA ${nextRace.round}`;

  function tick() {
    const d = rcDate - new Date();
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
    <div class="search-result" onclick="closeSearch();showToast('Abrindo Matéria: ${a.title}')">
      <img class="sr-img" src="${a.img}" alt="">
      <div>
        <div class="sr-title">${a.title}</div>
        <div class="sr-meta">${a.author} · ${a.cat.toUpperCase()}</div>
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
  openModal('articleOverlay');
  // Dynamic article logic comes later if needed on homepage. Currently search uses toast.
}

/* ====== LOAD NEWS (HYBRID RSS + SAAS) ====== */
async function loadLiveNews() {
  // 1. Fetch SaaS Published Articles (Admin Interno)
  const saasArticles = PitLane.getArticlesByStatus('published').map(a => {
    const u = PitLane.getUserById(a.authorId);
    return {
      id: a.id,
      cat: a.category ? a.category.toLowerCase().replace(' ', '') : 'news',
      badge: a.category ? a.category : 'SAAS',
      kicker: u && u.type === 'equipe' ? 'EQUIPE OFICIAL' : 'PILOTO OFICIAL',
      title: a.title,
      author: u ? u.name : 'Unknown',
      av: u ? u.avatar : 'PL',
      date: PitLane.formatDate(a.publishedAt),
      img: a.img || 'https://loremflickr.com/760/320/racing?lock='+a.id,
      body: a.body
    };
  });
  
  // 2. Fetch Nossa Nova API de Pipeline (Next.js)
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('Falha no Pipeline Local');
    const { data } = await res.json();
    
    // Mesclar feed Brasil e Global
    const pipelineFeed = [...(data.brasil || []), ...(data.global || [])];
    
    // Formatar pro modelo do layout
    const rssArticles = pipelineFeed.map((n, i) => {
      return {
        id: 'rss' + i,
        cat: 'f1',
        badge: 'f1',
        kicker: 'LATEST NEWS',
        title: n.title,
        author: n.author,
        av: '📰',
        date: new Date(n.pubDate).toLocaleDateString('pt-BR'),
        img: n.thumbnail,
        body: `<p>Leia a matéria completa na íntegra no site de origem.</p><a href="${n.link}" target="_blank" class="btn-secondary">Ler Matéria Origial →</a>`
      };
    });
    
    // Mix them (ex: exibir 4 SaaS locais da tabela news_feed mockada e 6 reais da API paralela)
    ARTICLES = [...saasArticles.slice(0, 4), ...rssArticles.slice(0, 6)];
    
  } catch (err) {
    console.error("News Pipeline Falhou, caindo pro mock...", err);
  }
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
document.addEventListener('DOMContentLoaded', async ()=>{
  // Initiate parallel fetches for max performance
  renderStandings([]); // Renders "loading"
  
  loadLiveStandings();
  initLiveCountdown();
  loadLiveNews();
  
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
