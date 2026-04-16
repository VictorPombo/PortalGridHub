/* =====================================================
   DRIVER NEWS — HOMEPAGE JS (LIVE DATA)
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
     Driver.Live.getDriverStandings(),
     Driver.Live.getConstructorStandings()
  ]);
  
  if(d.length > 0) {
    maxPoints = Math.max(parseFloat(d[0].points), parseFloat(c[0]?.points || 0), 1);
    
    liveDrivers = d.map((r, i) => {
      const p = parseFloat(r.points);
      return {
        pos: r.position,
        cls: i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '',
        flag: '<i class="fi fi-rr-flag-checkered"></i>', 
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
        flag: '<i class="fi fi-rr-car-side"></i>', 
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
  const nextRace = await Driver.Live.getNextRace();
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
// removed stub, using openArticle from app.js

/* ====== LOAD NEWS (HYBRID RSS + SAAS) ====== */
async function loadLiveNews() {
  // 1. Fetch SaaS Published Articles (Admin Interno)
  const saasArticles = Driver.getArticlesByStatus('published').map(a => {
    const u = Driver.getUserById(a.authorId);
    return {
      id: a.id,
      cat: a.category ? a.category.toLowerCase().replace(' ', '') : 'news',
      badge: a.category ? a.category : 'SAAS',
      kicker: u && u.type === 'equipe' ? 'EQUIPE OFICIAL' : 'PILOTO OFICIAL',
      title: a.title,
      author: u ? u.name : 'Unknown',
      av: u ? u.avatar : 'PL',
      date: Driver.formatDate(a.publishedAt),
      img: a.img || 'https://loremflickr.com/760/320/racing?lock='+a.id,
      body: a.body,
      isReal: false
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
    const rssArticles = pipelineFeed.map((n, i) => ({
      id: 'pr' + i,
      cat: (n.category || 'geral').toLowerCase().replace(/ /g, ''),
      badge: (n.category || 'geral').toLowerCase().replace(/ /g, ''),
      kicker: 'PRESS RELEASE',
      title: n.title,
      link: n.source_url || '#',
      author: n.source || 'Driver News',
      av: '<i class="fi fi-rr-megaphone"></i>',
      date: new Date(n.published_at).toLocaleDateString('pt-BR'),
      img: n.image_url || '/images/placeholder-geral.jpg',
      body: n.excerpt || '',
      isReal: true,
      isTranslated: n.was_translated || false,
      source: n.source || '',
      sourceUrl: n.source_url || '',
      feedTipo: n.tipo || 'oficial_news',
    }));
    
    // Mix them: Dar prioridade total absoluta às Notícias Reais (2 Reais para 1 SaaS)
    const mixed = [];
    let rIdx = 0, sIdx = 0;
    while (rIdx < rssArticles.length || sIdx < saasArticles.length) {
      if (rIdx < rssArticles.length) mixed.push(rssArticles[rIdx++]);
      if (rIdx < rssArticles.length) mixed.push(rssArticles[rIdx++]);
      if (rIdx < rssArticles.length) mixed.push(rssArticles[rIdx++]); // 3 Reais
      if (sIdx < saasArticles.length) mixed.push(saasArticles[sIdx++]); // 1 SaaS
    }
    
    if (mixed.length < 3) {
      throw new Error('API respondeu mas com noticias insuficientes. Forçando fallback mock.');
    }
    ARTICLES = mixed;
    
    // Agora renderizar dinamicamente na Página inteira!
    renderHeroGrid();
    renderNewsGrid();
    renderVidGrid();
    renderSplitGrids();
    renderTicker();

    // Auto-open article from URL query params
    const params = new URLSearchParams(window.location.search);
    if(params.has('art')) {
      const artId = params.get('art');
      setTimeout(() => {
        if(typeof window.openArticle === 'function') {
          window.openArticle(artId);
        }
      }, 500);
    }



  } catch (err) {
    console.error("News Pipeline Falhou, caindo pro mock...", err);
    ARTICLES = saasArticles.length >= 15 ? saasArticles : [
      ...saasArticles,
      { id:'1', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'Antonelli lidera F1 2026 com 72 pts — ANÁLISE DRIVER', link:'#', author:'Driver', av:'PL', date: new Date().toLocaleDateString('pt-BR'), img:'https://loremflickr.com/800/400/formula1?lock=31', body:'', isReal:true },
      { id:'2', cat:'motogp', badge:'motogp', kicker:'LATEST NEWS', title:'Bagnaia e Márquez disputam as décimas de segundo em final eletrizante', link:'#', author:'Driver', av:'PL', date: new Date().toLocaleDateString('pt-BR'), img:'https://loremflickr.com/400/280/motorcycle?lock=32', body:'', isReal:true },
      { id:'3', cat:'wec', badge:'wec', kicker:'LATEST NEWS', title:'Ferrari Hypercar mostra bom rendimento e desafia a Toyota em Le Mans', link:'#', author:'Driver', av:'PL', date: new Date().toLocaleDateString('pt-BR'), img:'https://loremflickr.com/400/280/hypercar?lock=33', body:'', isReal:true },
      { id:'4', cat:'nascar', badge:'nascar', kicker:'LATEST NEWS', title:'Drafting e Bump and Run: as estratégias decisivas de Talladega', link:'#', author:'Driver', av:'PL', date: new Date().toLocaleDateString('pt-BR'), img:'https://loremflickr.com/400/280/nascar?lock=34', body:'', isReal:true },
      { id:'5', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'O mercado de pilotos agitado para a próxima janela de transferências', link:'#', author:'Driver', av:'PL', date:'06/04/2026', img:'https://loremflickr.com/400/280/racecar?lock=35', body:'', isReal:true },
      { id:'6', cat:'sim', badge:'sim', kicker:'LATEST NEWS', title:'iRacing anuncia novo update revolucionário com clima totalmente dinâmico', link:'#', author:'Driver', av:'PL', date:'05/04/2026', img:'https://loremflickr.com/400/280/simracing?lock=36', body:'', isReal:true },
      { id:'7', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'Revolução aerodinâmica: o segredo da asa flexível na F1 2026', link:'#', author:'Driver', av:'PL', date:'04/04/2026', img:'https://loremflickr.com/400/280/f1?lock=37', body:'', isReal:true },
      { id:'8', cat:'wrc', badge:'wrc', kicker:'LATEST NEWS', title:'Rally Rovanperä domina com folga as neves remotas do Norte', link:'#', author:'Driver', av:'PL', date:'03/04/2026', img:'https://loremflickr.com/400/280/rally?lock=38', body:'', isReal:true },
      { id:'9', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'Pit stops impressionantes na casa do 1.5s viram o novo padrão', link:'#', author:'Driver', av:'PL', date:'02/04/2026', img:'https://loremflickr.com/400/280/pitstop?lock=39', body:'', isReal:true },
      { id:'10', cat:'motogp', badge:'motogp', kicker:'LATEST NEWS', title:'Aerodinâmica excessiva: pilotos reclamam abertamente das turbulências', link:'#', author:'Driver', av:'PL', date:'01/04/2026', img:'https://loremflickr.com/400/280/bike?lock=40', body:'', isReal:true },
      { id:'11', cat:'wec', badge:'wec', kicker:'LATEST NEWS', title:'Porsche anuncia pacote de expansão ambicioso na classe LMDh', link:'#', author:'Driver', av:'PL', date:'31/03/2026', img:'https://loremflickr.com/400/280/lemans?lock=41', body:'', isReal:true },
      { id:'12', cat:'sim', badge:'sim', kicker:'LATEST NEWS', title:'Assetto Corsa Evo vs iRacing: Qual a melhor engine baseada na atualidade?', link:'#', author:'Driver', av:'PL', date:'30/03/2026', img:'https://loremflickr.com/400/280/sim?lock=42', body:'', isReal:true },
      { id:'13', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'Rumores do Paddock: Audi prepara aquisição surpresa no grid?', link:'#', author:'Driver', av:'PL', date:'29/03/2026', img:'https://loremflickr.com/400/280/audi?lock=43', body:'', isReal:true },
      { id:'14', cat:'motogp', badge:'motogp', kicker:'LATEST NEWS', title:'Recordes caindo: Bagnaia crava volta espetacular em testes na Ásia', link:'#', author:'Driver', av:'PL', date:'28/03/2026', img:'https://loremflickr.com/400/280/bagnaia?lock=44', body:'', isReal:true },
      { id:'15', cat:'wec', badge:'wec', kicker:'LATEST NEWS', title:'A revolução verde: detalhes do novo bio-combustível no endurance', link:'#', author:'Driver', av:'PL', date:'27/03/2026', img:'https://loremflickr.com/400/280/fuel?lock=45', body:'', isReal:true }
    ];
    renderHeroGrid();
    renderNewsGrid();
    renderVidGrid();
    renderSplitGrids();
    renderTicker();
  }
}

function renderHeroGrid() {
  const grid = document.getElementById('heroGrid');
  if(!grid || ARTICLES.length < 3) return;

  const aM = ARTICLES[0];
  const aS1 = ARTICLES[1];
  const aS2 = ARTICLES[2];

  const goM = aM.isReal ? `window.open('${aM.link}', '_blank')` : `openArticle('${aM.id}')`;
  const goS1 = aS1.isReal ? `window.open('${aS1.link}', '_blank')` : `openArticle('${aS1.id}')`;
  const goS2 = aS2.isReal ? `window.open('${aS2.link}', '_blank')` : `openArticle('${aS2.id}')`;

  grid.innerHTML = `
    <div class="hero-main" onclick="${goM}; if(${aM.isReal}) showToast('Redirecionando...')">
      <img src="${aM.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="${aM.title}">
      <div class="hero-content">
        <span class="badge ${aM.cat}">${aM.badge.toUpperCase()}</span>
        <h1 class="hero-title">${aM.title}</h1>
        <p class="hero-excerpt">Destaque do portal — Clique para ler a matéria completa sobre os últimos acontecimentos.</p>
        <div class="hero-meta">
          <span>${aM.author}</span><span>${aM.date}</span>
        </div>
      </div>
    </div>
    <div class="hero-side">
      <div class="side-card" onclick="${goS1}; if(${aS1.isReal}) showToast('Redirecionando...')">
        <img src="${aS1.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="">
        <div class="side-content">
          <span class="badge ${aS1.cat}">${aS1.badge.toUpperCase()}</span>
          <div class="side-title">${aS1.title}</div>
          <div class="side-meta">${aS1.author.slice(0,10)} · ${aS1.date}</div>
        </div>
      </div>
      <div class="side-card" onclick="${goS2}; if(${aS2.isReal}) showToast('Redirecionando...')">
        <img src="${aS2.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="">
        <div class="side-content">
          <span class="badge ${aS2.cat}">${aS2.badge.toUpperCase()}</span>
          <div class="side-title">${aS2.title}</div>
          <div class="side-meta">${aS2.author.slice(0,10)} · ${aS2.date}</div>
        </div>
      </div>
    </div>
  `;
}

function renderNewsGrid() {
  const grid = document.getElementById('cardGrid');
  if(!grid) return;
  if(ARTICLES.length < 7) return;

  // Pegar matérias do index 3 ao 6
  const displayArticles = ARTICLES.slice(3, 7);
  
  grid.innerHTML = displayArticles.map((a, i) => {
    // A primeira matéria fica com a classe 'feat'
    const isFeat = i === 0;
    const clickAction = a.isReal ? `window.open('${a.link}', '_blank')` : `openArticle('${a.id}')`;
    
    return `
      <div class="ncard ${isFeat ? 'feat' : ''}" data-cat="${a.cat}" data-id="${a.id}" onclick="${clickAction}; if(a.isReal) showToast('Redirecionando para matéria oficial...')">
        <div class="ncard-thumb"><img src="${a.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt=""></div>
        <div class="ncard-body">
          <span class="badge ${a.cat}">${a.badge.toUpperCase()}</span>
          <div class="ncard-title">${a.title}</div>
          <div class="ncard-excerpt">${isFeat ? 'Acompanhe de perto as novidades e análises das principais categorias no automobilismo mundial.' : ''}</div>
          <div class="ncard-meta">
            <div class="pr-header">
              <span class="badge-pr">PRESS RELEASE</span>
              <span class="pr-source">Fonte: <strong>${a.author}</strong></span>
              ${a.isTranslated ? '<span class="pr-translated"> Traduzido</span>' : ''}
            </div>
            <div class="pr-footer">
              <span class="pr-date">${a.date}</span>
              ${a.sourceUrl ? `<a href="${a.sourceUrl}" target="_blank" rel="noopener noreferrer" class="pr-ver-original" onclick="event.stopPropagation()">Ver original ↗</a>` : ''} 
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Reaplicar a animação (obs) se necessário
  document.querySelectorAll('.ncard').forEach((c,i)=>{
    c.style.transitionDelay=(i*.07)+'s'; c.classList.add('reveal');
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
    },{threshold:0.07});
    obs.observe(c);
  });
}

function renderVidGrid() {
  const grid = document.getElementById('vidGrid');
  if(!grid || ARTICLES.length < 10) return;

  const displayArticles = ARTICLES.slice(7, 10);
  
  grid.innerHTML = displayArticles.map((a, i) => {
    // Apenas reutilizamos cards de notícia pois não temos a API do Youtube original integrada
    const isFeat = i === 0;
    const clickAction = a.isReal ? `window.open('${a.link}', '_blank')` : `openArticle('${a.id}')`;
    
    return `
      <div class="vcard ${isFeat ? 'feat' : ''}" onclick="${clickAction}; if(a.isReal) showToast('Redirecionando...')">
        <div class="vthumb">
          <img src="${a.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="">
          <div class="play-btn"><div class="play-arr"></div></div>
        </div>
        <div class="vinfo">
          <span class="badge ${a.cat}">${a.badge.toUpperCase()}</span>
          <div class="vtitle">${a.title}</div>
          <div class="vmeta">${a.date} · EM DESTAQUE</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderSplitGrids() {
  const opGrid = document.getElementById('opGrid');
  const mktGrid = document.getElementById('mktGrid');
  if(!opGrid || !mktGrid || ARTICLES.length < 15) return;

  // Opinião -> Index 10 e 11
  const opArts = ARTICLES.slice(10, 12);
  opGrid.innerHTML = opArts.map(a => {
    const clickAction = a.isReal ? `window.open('${a.link}', '_blank')` : `openArticle('${a.id}')`;
    return `
      <div class="op-card" onclick="${clickAction}; if(a.isReal) showToast('Redirecionando...')">
        <div class="op-tag">Especial</div>
        <div class="op-title">${a.title}</div>
        <div class="op-excerpt">Leia a análise aprofundada direto da redação.</div>
        <div class="op-author">
          <div class="op-avatar"><i class="fi fi-rr-newspaper"></i></div>
          <div><div class="op-name">${a.author}</div><div class="op-role">${a.date}</div></div>
        </div>
      </div>
    `;
  }).join('');

  // Mercado -> Index 12, 13, 14
  const mktArts = ARTICLES.slice(12, 15);
  mktGrid.innerHTML = mktArts.map(a => {
    const clickAction = a.isReal ? `window.open('${a.link}', '_blank')` : `openArticle('${a.id}')`;
    return `
      <div class="mkt-card" onclick="${clickAction}; if(a.isReal) showToast('Redirecionando...')">
        <div class="mkt-thumb"><img src="${a.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt=""></div>
        <div class="mkt-body">
          <span class="badge ${a.cat}">${a.badge.toUpperCase()}</span>
          <div class="mkt-title">${a.title}</div>
          <div class="mkt-meta">${a.date}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTicker() {
  const track = document.querySelector('.ticker-track');
  if(!track) return;
  const breaking = ARTICLES.slice(0, 5); // top 5
  if(breaking.length === 0) return;
  
  // Duplicamos as matérias pro ticker não quebrar no loop do css
  const itemsHTML = [...breaking, ...breaking, ...breaking].map(a => {
    const clickAction = a.isReal ? `window.open('${a.link}', '_blank')` : `openArticle('${a.id}')`;
    return `<span class="ticker-item" onclick="${clickAction}">${a.title}</span>`;
  }).join('');
  
  track.innerHTML = itemsHTML;
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
    showToast('<i class="fi fi-rr-exclamation"></i> Insira um e-mail válido','err'); return;
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
  
  // 1. Inicializa Conexão Supabase Primeiro!
  await Driver.bootSupabase();

  loadLiveStandings();
  initLiveCountdown();
  loadLiveNews();
  
  // Search input listener
  const si = document.getElementById('searchInput');
  if(si) si.addEventListener('input', e=>renderSearchResults(e.target.value));
  
  // Restore bookmarks
  bookmarks.forEach(id=>{
    document.querySelector(`.ncard-bm[onclick*="toggleBookmark(this,'${id}')"]`)?.classList.add('saved');
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
