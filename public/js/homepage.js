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
  let saasRaw = Driver.getArticlesByStatus('published').filter(a => !a.deleted);
  
  // Odenar da mais nova para a mais velha rigidamente
  saasRaw.sort((a, b) => new Date(b.publishedAt || b.submittedAt || 0) - new Date(a.publishedAt || a.submittedAt || 0));

  const saasArticles = saasRaw.map(a => {
    const u = Driver.getUserById(a.authorId);
    return {
      id: a.id,
      cat: a.category ? a.category.toLowerCase().replace(' ', '') : 'news',
      badge: a.category ? a.category : 'SAAS',
      kicker: u && u.type === 'equipe' ? 'EQUIPE OFICIAL' : 'PILOTO OFICIAL',
      title: a.title,
      author: u ? u.name : 'Unknown',
      av: u ? u.avatar : 'PL',
      date: Driver.formatDate(a.publishedAt || a.submittedAt || new Date().toISOString()),
      rawDate: a.publishedAt || a.submittedAt || new Date().toISOString(),
      img: (a.img && a.img.trim() !== '') ? a.img : 'https://images.unsplash.com/photo-1541344983572-c511a5fe03fd?q=80&w=1200&auto=format&fit=crop',
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
    let rssArticles = pipelineFeed.map((n, i) => {
      // Define a badge com base nas categorias
      let cat = 'f1';
      let badge = 'f1';
      const cLower = (n.categories || []).join(' ').toLowerCase();
      if (cLower.includes('motogp')) { cat = 'motogp'; badge = 'motogp'; }
      else if (cLower.includes('wec') || cLower.includes('endurance') || cLower.includes('lemans')) { cat = 'wec'; badge = 'wec'; }
      else if (cLower.includes('nascar')) { cat = 'nascar'; badge = 'nascar'; }
      else if (cLower.includes('sim')) { cat = 'sim'; badge = 'sim'; }

      return {
        id: 'rss' + i,
        cat: cat,
        badge: badge,
        kicker: 'LATEST NEWS',
        title: n.title,
        link: n.link, // Usado para redirecionar
        author: n.author || 'Mídia',
        av: '<i class="fi fi-rr-newspaper"></i>',
        date: new Date(n.pubDate).toLocaleDateString('pt-BR'),
        rawDate: n.pubDate,
        img: n.thumbnail,
        body: '',
        isReal: true
      };
    });

    // Odenar RSS feed das mais novas para as mais velhas
    rssArticles.sort((a,b) => new Date(b.rawDate) - new Date(a.rawDate));
    
    // ORQUESTRADOR DOS ESPAÇOS (MIXER INTELIGENTE)
    let finalArray = [];
    
    // Espaço 1: O Trono do Hero (Regra de 48 horas)
    const newestSaas = saasArticles.length > 0 ? saasArticles[0] : null;
    let mainHighlight = null;
    
    if (newestSaas) {
      const msDiff = Date.now() - new Date(newestSaas.rawDate).getTime();
      const hoursDiff = msDiff / (1000 * 60 * 60);
      
      // Se tiver menos de 48h, a matéria do piloto ganha. Removemos do banco de reserva saas.
      if (hoursDiff <= 48) {
        mainHighlight = newestSaas;
        saasArticles.shift();
      }
    }
    
    // Se o piloto perdeu/esfriou, colocamos o RSS novinho. Removemos do banco de reserva RSS.
    if (!mainHighlight) {
      mainHighlight = rssArticles.shift();
    }
    
    // Espaço 2: Notícia da F1 estritamente
    let articleSlot2 = rssArticles.find(a => a.cat === 'f1');
    if (articleSlot2) {
      rssArticles = rssArticles.filter(a => a.id !== articleSlot2.id); // Tira da reserva
    } else {
      articleSlot2 = rssArticles.shift(); // Fallback genérico se F1 não existir
    }

    // Espaço 3: Notícia da MotoGP estritamente
    let articleSlot3 = rssArticles.find(a => a.cat === 'motogp');
    if (articleSlot3) {
      rssArticles = rssArticles.filter(a => a.id !== articleSlot3.id); // Tira da reserva
    } else {
      articleSlot3 = rssArticles.shift(); // Fallback genérico
    }

    // Injeta as 3 recheadas para o Hero
    finalArray.push(mainHighlight);
    finalArray.push(articleSlot2 || saasArticles.shift());
    finalArray.push(articleSlot3 || saasArticles.shift());
    
    // Espaços restantes (Misturando 2 RSS globais para cada 1 Matéria velha de SaaS para encher o site)
    let rIdx = 0, sIdx = 0;
    while (rIdx < rssArticles.length || sIdx < saasArticles.length) {
      if (rIdx < rssArticles.length) finalArray.push(rssArticles[rIdx++]);
      if (rIdx < rssArticles.length) finalArray.push(rssArticles[rIdx++]);
      if (sIdx < saasArticles.length) finalArray.push(saasArticles[sIdx++]);
    }
    
    // Limpar quaisquer undefined q escapem se as listas acabarem
    finalArray = finalArray.filter(x => x);
    
    if (finalArray.length < 4) {
      throw new Error('API respondeu mas com noticias insuficientes. Forçando fallback mock.');
    }
    
    ARTICLES = finalArray;
    
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
    // Cria array com a mesma estrutura de rssArticles vindo da API
    const mockRss = [
      { id:'m1', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'Antonelli lidera F1 2026 com 72 pts — ANÁLISE DRIVER', author:'Driver', date: new Date().toLocaleDateString('pt-BR'), rawDate: new Date().toISOString(), img:'https://loremflickr.com/800/400/formula1?lock=31', body:'', isReal:true, link:'#' },
      { id:'m2', cat:'motogp', badge:'motogp', kicker:'LATEST NEWS', title:'Bagnaia e Márquez disputam as décimas de segundo em final eletrizante', author:'Driver', date: new Date().toLocaleDateString('pt-BR'), rawDate: new Date().toISOString(), img:'https://loremflickr.com/400/280/motorcycle?lock=32', body:'', isReal:true, link:'#' },
      { id:'m3', cat:'wec', badge:'wec', kicker:'LATEST NEWS', title:'Ferrari Hypercar mostra bom rendimento e desafia a Toyota em Le Mans', author:'Driver', date: new Date().toLocaleDateString('pt-BR'), rawDate: new Date().toISOString(), img:'https://loremflickr.com/400/280/hypercar?lock=33', body:'', isReal:true, link:'#' },
      { id:'m4', cat:'nascar', badge:'nascar', kicker:'LATEST NEWS', title:'Drafting e Bump and Run: as estratégias decisivas de Talladega', author:'Driver', date: new Date().toLocaleDateString('pt-BR'), rawDate: new Date().toISOString(), img:'https://loremflickr.com/400/280/nascar?lock=34', body:'', isReal:true, link:'#' },
      { id:'m5', cat:'f1', badge:'f1', kicker:'LATEST NEWS', title:'O mercado de pilotos agitado para a próxima janela de transferências', author:'Driver', date:'06/04/2026', rawDate:'2026-04-06T12:00:00Z', img:'https://loremflickr.com/400/280/racecar?lock=35', body:'', isReal:true, link:'#' },
      { id:'m6', cat:'motogp', badge:'motogp', kicker:'LATEST NEWS', title:'Aerodinâmica excessiva: pilotos reclamam abertamente das turbulências', author:'Driver', date:'01/04/2026', rawDate:'2026-04-01T12:00:00Z', img:'https://loremflickr.com/400/280/bike?lock=40', body:'', isReal:true, link:'#' }
    ];

    // ORQUESTRADOR DOS ESPAÇOS IGUAL COMO NO FEED REAL
    let finalArray = [];
    const newestSaas = saasArticles.length > 0 ? saasArticles[0] : null;
    let mainHighlight = null;
    
    if (newestSaas) {
      const msDiff = Date.now() - new Date(newestSaas.rawDate).getTime();
      const hoursDiff = msDiff / (1000 * 60 * 60);
      if (hoursDiff <= 48) {
        mainHighlight = newestSaas;
        saasArticles.shift();
      }
    }
    if (!mainHighlight) mainHighlight = mockRss.shift();
    
    let articleSlot2 = mockRss.find(a => a.cat === 'f1');
    if (articleSlot2) mockRss.splice(mockRss.indexOf(articleSlot2), 1);
    else articleSlot2 = mockRss.shift();

    let articleSlot3 = mockRss.find(a => a.cat === 'motogp');
    if (articleSlot3) mockRss.splice(mockRss.indexOf(articleSlot3), 1);
    else articleSlot3 = mockRss.shift();

    // Injeta
    finalArray.push(mainHighlight);
    finalArray.push(articleSlot2 || saasArticles.shift());
    finalArray.push(articleSlot3 || saasArticles.shift());

    // Merge
    let rIdx = 0, sIdx = 0;
    while (rIdx < mockRss.length || sIdx < saasArticles.length) {
      if (rIdx < mockRss.length) finalArray.push(mockRss[rIdx++]);
      if (rIdx < mockRss.length) finalArray.push(mockRss[rIdx++]);
      if (sIdx < saasArticles.length) finalArray.push(saasArticles[sIdx++]);
    }

    ARTICLES = finalArray.filter(x => x);

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

  const lM = aM.isReal ? aM.link : '/materia/' + aM.id;
  const lS1 = aS1.isReal ? aS1.link : '/materia/' + aS1.id;
  const lS2 = aS2.isReal ? aS2.link : '/materia/' + aS2.id;
  const tM = aM.isReal ? '_blank' : '_self';
  const tS1 = aS1.isReal ? '_blank' : '_self';
  const tS2 = aS2.isReal ? '_blank' : '_self';

  grid.innerHTML = `
    <a href="${lM}" target="${tM}" class="hero-main" onclick="${aM.isReal ? "showToast('Redirecionando...')" : ""}">
      <img src="${aM.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="${aM.title}">
      <div class="hero-content">
        <span class="badge ${aM.cat}">${aM.badge.toUpperCase()}</span>
        <h1 class="hero-title">${aM.title}</h1>
        <p class="hero-excerpt">Destaque do portal — Clique para ler a matéria completa sobre os últimos acontecimentos.</p>
        <div class="hero-meta">
          <span>${aM.author}</span><span>${aM.date}</span>
        </div>
      </div>
    </a>
    <div class="hero-side">
      <a href="${lS1}" target="${tS1}" class="side-card" onclick="${aS1.isReal ? "showToast('Redirecionando...')" : ""}">
        <img src="${aS1.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="">
        <div class="side-content">
          <span class="badge ${aS1.cat}">${aS1.badge.toUpperCase()}</span>
          <div class="side-title">${aS1.title}</div>
          <div class="side-meta">${(aS1.author || 'MÍDIA').slice(0,10)} · ${aS1.date}</div>
        </div>
      </a>
      <a href="${lS2}" target="${tS2}" class="side-card" onclick="${aS2.isReal ? "showToast('Redirecionando...')" : ""}">
        <img src="${aS2.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="">
        <div class="side-content">
          <span class="badge ${aS2.cat}">${aS2.badge.toUpperCase()}</span>
          <div class="side-title">${aS2.title}</div>
          <div class="side-meta">${(aS2.author || 'MÍDIA').slice(0,10)} · ${aS2.date}</div>
        </div>
      </a>
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
    const lUrl = a.isReal ? a.link : '/materia/' + a.id;
    const tUrl = a.isReal ? '_blank' : '_self';
    const clickAttr = a.isReal ? `onclick="showToast('Redirecionando para matéria oficial...')"` : '';
    
    return `
      <a href="${lUrl}" target="${tUrl}" class="ncard ${isFeat ? 'feat' : ''}" data-cat="${a.cat}" data-id="${a.id}" ${clickAttr} style="text-decoration:none;color:inherit;display:flex;flex-direction:column;">
        <div class="ncard-thumb"><img src="${a.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt=""></div>
        <div class="ncard-body">
          <span class="badge ${a.cat}">${a.badge.toUpperCase()}</span>
          <div class="ncard-title">${a.title}</div>
          <div class="ncard-excerpt">${isFeat ? 'Acompanhe de perto as novidades e análises das principais categorias no automobilismo mundial.' : ''}</div>
          <div class="ncard-meta">
            <span>${a.date} · ${(a.author || 'MÍDIA').toUpperCase().slice(0,15)}</span>
            <div class="ncard-bm" onclick="event.preventDefault(); event.stopPropagation(); toggleBookmark(this,'${a.id}')" title="Salvar"><i class="fi fi-rr-bookmark"></i></div>
          </div>
        </div>
      </a>
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
    const lUrl = a.isReal ? a.link : '/materia/' + a.id;
    const tUrl = a.isReal ? '_blank' : '_self';
    const clickAttr = a.isReal ? `onclick="showToast('Redirecionando...')"` : '';
    
    return `
      <a href="${lUrl}" target="${tUrl}" class="vcard ${isFeat ? 'feat' : ''}" ${clickAttr} style="text-decoration:none;color:inherit;">
        <div class="vthumb">
          <img src="${a.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt="">
          <div class="play-btn"><div class="play-arr"></div></div>
        </div>
        <div class="vinfo">
          <span class="badge ${a.cat}">${a.badge.toUpperCase()}</span>
          <div class="vtitle">${a.title}</div>
          <div class="vmeta">${a.date} · EM DESTAQUE</div>
        </div>
      </a>
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
    const lUrl = a.isReal ? a.link : '/materia/' + a.id;
    const tUrl = a.isReal ? '_blank' : '_self';
    const clickAttr = a.isReal ? `onclick="showToast('Redirecionando...')"` : '';
    return `
      <a href="${lUrl}" target="${tUrl}" class="op-card" ${clickAttr} style="text-decoration:none;color:inherit;display:flex;flex-direction:column;">
        <div class="op-tag">Especial</div>
        <div class="op-title">${a.title}</div>
        <div class="op-excerpt">Leia a análise aprofundada direto da redação.</div>
        <div class="op-author">
          <div class="op-avatar"><i class="fi fi-rr-newspaper"></i></div>
          <div><div class="op-name">${a.author}</div><div class="op-role">${a.date}</div></div>
        </div>
      </a>
    `;
  }).join('');

  // Mercado -> Index 12, 13, 14
  const mktArts = ARTICLES.slice(12, 15);
  mktGrid.innerHTML = mktArts.map(a => {
    const lUrl = a.isReal ? a.link : '/materia/' + a.id;
    const tUrl = a.isReal ? '_blank' : '_self';
    const clickAttr = a.isReal ? `onclick="showToast('Redirecionando...')"` : '';
    return `
      <a href="${lUrl}" target="${tUrl}" class="mkt-card" ${clickAttr} style="text-decoration:none;color:inherit;display:flex;">
        <div class="mkt-thumb"><img src="${a.img}" onerror="this.onerror=null;this.src='img/news-placeholder.png'" alt=""></div>
        <div class="mkt-body">
          <span class="badge ${a.cat}">${a.badge.toUpperCase()}</span>
          <div class="mkt-title">${a.title}</div>
          <div class="mkt-meta">${a.date}</div>
        </div>
      </a>
    `;
  }).join('');
}

function renderTicker() {
  const track = document.querySelector('.ticker-track');
  if(!track) return;
  const breaking = ARTICLES.slice(0, 5); // top 5
  if(breaking.length === 0) return;
  
  const itemsHTML = [...breaking, ...breaking, ...breaking].map(a => {
    const lUrl = a.isReal ? a.link : '/materia/' + a.id;
    const tUrl = a.isReal ? '_blank' : '_self';
    return `<a href="${lUrl}" target="${tUrl}" class="ticker-item" style="text-decoration:none;color:inherit;">${a.title}</a>`;
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
