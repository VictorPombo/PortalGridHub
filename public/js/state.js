/* =====================================================
   DRIVER NEWS — SHARED STATE MANAGEMENT
   All pages use this as the single source of truth.
   Data is persisted to localStorage.
   ===================================================== */

const Driver = (() => {
  const KEYS = {
    users: 'pl_users',
    articles: 'pl_articles',
    session: 'pl_session',
    stats: 'pl_stats',
    settings: 'pl_settings',
  };

  // ============================
  // DATABASE CACHE (Supabase memory)
  // ============================
  let __dbUsers = load(KEYS.users, typeof SEED_USERS !== 'undefined' ? SEED_USERS : []);
  
  // MIGRATION: Protege contra crash no cache legado do frontend antes do fetch do Supabase terminar
  if (Array.isArray(__dbUsers)) {
    __dbUsers.forEach(u => {
      if (u.is_active === undefined) {
         u.is_active = (u.status === 'active' || u.status === 'admin' || u.type === 'admin');
      }
    });
  }

  let __dbArticles = load(KEYS.articles, typeof SEED_ARTICLES !== 'undefined' ? SEED_ARTICLES : []);

  // INJETANDO O USUÁRIO SOLICITADO NO FALLBACK (CASO SUPABASE NÃO CONECTE)
  if (!__dbUsers.find(u => u.email === 'victordeassis2010@hotmail.com')) {
    __dbUsers.push({
      id: 'superadmin_1',
      name: 'Victor Assis',
      email: 'victordeassis2010@hotmail.com',
      password: '29183627Mae', // Mocks apenas para o fallback
      type: 'piloto',
      plan: 'pro',
      is_active: true,
      avatar: 'VA'
    });
    save(KEYS.users, __dbUsers);
  }

  const RACING_CATEGORIES = {
    "KART": ["Kart Indoor", "Kart Rental", "Kart Profissional 2T", "Kart F4", "Kart Graduados", "Kart Sênior", "Kart Super Sênior", "Kart Shifter", "Kart Endurance", "Kart Cadete / Mirim"],
    "FÓRMULA": ["Fórmula Vee", "Fórmula Delta", "Fórmula 1600", "Fórmula Inter", "Fórmula 4", "Fórmula 3", "Fórmula Truck Light"],
    "TURISMO": ["Stock Car Pro Series", "Stock Series", "Turismo Nacional", "Copa HB20", "Copa Shell HB20", "NASCAR Brasil", "TCR South America", "Turismo 1.4", "Marcas e Pilotos", "Super Turismo"],
    "GT": ["Porsche Cup Brasil", "AMG Cup Brasil", "GT Series Brasil", "Império Endurance Brasil", "Ultimate Drift"],
    "ENDURANCE": ["Império Endurance Brasil", "6 Horas de Interlagos", "Endurance Regional"],
    "DRIFT": ["Ultimate Drift", "Drift Brasil", "Fórmula Drift Brasil"],
    "RALLY": ["Rally dos Sertões", "Rally Mitsubishi Motorsports", "Rally Baja", "Rally Velocidade", "Rally Raid", "Camp. Brasileiro de Rally", "Copa Troller", "Jeep Experience"],
    "TRACK DAY": ["Track Day aberto", "Time Attack Brasil", "Hot Lap Competitions"],
    "MOTO (BASE)": ["Minimoto", "Escola de pilotagem", "Categorias 300cc", "Categorias 400cc"],
    "MOTO (INTERMEDIÁRIO)": ["Yamaha R3 Cup", "Ninja 400 Cup", "Copa Pro Honda CBR", "Categorias monomarca"],
    "MOTO (PRO)": ["SuperBike Brasil", "Moto1000GP", "Supersport 600cc", "SuperSport 300cc", "Categoria 1000cc"],
    "MOTO (OFF-ROAD)": ["Rally dos Sertões (motos)", "Enduro", "Motocross", "Supercross", "Hard Enduro"]
  };

  // Mantido Settings básico fixo na memória para testes locais sem login
  let __dbSettings = {
    reviewRequired: true,
    autoCollect: true,
    aiRewrite: true,
    limitBlock: true,
    sponsoredBadge: true,
    maintenance: false,
  };

  const PLAN_LIMITS = {
    starter: 1,
    pro: 6, // Temporário para testes (original era 2)
    equipe: 10,
    categoria: 30,
    admin: 999999, // Sem limite de postagens
  };

  const PLAN_NAMES = {
    starter: 'Piloto Starter',
    pro: 'Piloto Pro',
    equipe: 'Equipe',
    categoria: 'Categoria',
    admin: 'Acesso VIP Ilimitado',
  };

  const PLAN_PRICES = {
    starter: 'R$ 99,90',
    pro: 'R$ 149,90',
    equipe: 'R$ 499,90',
    categoria: 'R$ 999,90',
  };

  const STATUS_LABELS = {
    draft: 'Rascunho',
    sent: 'Enviado',
    review: 'Em Revisão',
    adjust: 'Ajustar',
    approved: 'Aprovada',
    published: 'Publicado',
    hidden: 'Oculto',
  };

  const STATUS_CSS = {
    draft: 'status-draft',
    sent: 'status-sent',
    review: 'status-review',
    adjust: 'status-adjust',
    approved: 'status-approved',
    published: 'status-published',
    hidden: 'status-draft',
  };

  // ============================
  // BOOTSTRAP: FETCH SUPABASE
  // ============================
  async function bootSupabase() {
    try {
      const resp = await fetch('/api/db/sync');
      if (!resp.ok) throw new Error('Falha ao conectar com Supabase DB via App Router');
      const data = await resp.json();
      
      if (data.success) {
        // Mapear Snake_Case (Supabase) -> CamelCase (JS Local)
        __dbUsers = data.users.map(u => ({
          ...u,
          createdAt: u.created_at,
          referredBy: u.referred_by,
          avatar: u.avatar || u.name.substring(0, 2).toUpperCase(),
        }));
        
        __dbArticles = data.articles.map(a => ({
          ...a,
          authorId: a.author_id,
          publishedAt: a.published_at,
          submittedAt: a.submitted_at
        }));
        save(KEYS.users, __dbUsers);
        save(KEYS.articles, __dbArticles);
        console.log("[Driver] Supabase Boot Completo:", __dbUsers.length, "Users,", __dbArticles.length, "Artigos carregados.");
        // Notify the UI that data is ready
        window.dispatchEvent(new Event('driver-data-ready'));
        // Directly re-render pilots if function exists (use window. since we're inside IIFE)
        if (typeof window.renderPilotsHighlight === 'function') window.renderPilotsHighlight();
        if (typeof window.renderPilotsList === 'function' && document.getElementById('pilotsListGrid')) window.renderPilotsList();
      }
    } catch (err) {
      console.warn("[Driver] Boot Supabase falhou, usando local storage.", err);
      // Fallback para não quebrar a UI
      __dbUsers = load(KEYS.users, typeof SEED_USERS !== 'undefined' ? SEED_USERS : []);
      __dbArticles = load(KEYS.articles, typeof SEED_ARTICLES !== 'undefined' ? SEED_ARTICLES : []);
    }
  }

  function save(key, data) {
    const isPersistable = [KEYS.session, KEYS.settings, KEYS.users, KEYS.articles].includes(key) || key.startsWith('pl_live_');
    if (isPersistable) {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch(e){}
    }
    if(key === KEYS.settings) __dbSettings = data;
    else if(key === KEYS.users) __dbUsers = data;
    else if(key === KEYS.articles) __dbArticles = data;
  }

  function load(key, defaultVal) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultVal;
    } catch(e) { return defaultVal; }
  }

  // Substituímos o init() antigo por isso
  function init() {
    console.log("Aguarde o bootSupabase() em vez de usar init() síncrono.");
  }

  function reset() {
    console.warn("Reset não aplicável em BD Nuvem.");
  }

  // ============================
  // USERS
  // ============================
  function getUsers() { return __dbUsers; }
  function getUserById(id) { return getUsers().find(u => u.id === id); }
  function getUsersByType(type) { return getUsers().filter(u => u.type === type); }
  async function addUser(user) {
    user.id = 'u' + (__dbUsers.length + 1) + '_' + Date.now(); // Fallback gen for cache
    user.createdAt = new Date().toISOString().split('T')[0];
    if (user.is_active === undefined) user.is_active = false; // Inativo até o webhook Asaas confirmar
    user.avatar = user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    
    // Tentativa de gravar no Supabase via API
    try {
      const resp = await fetch('/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await resp.json();
      if (data.success && data.user) {
        // Se a API inseriu com sucesso, substitui o ID do modelo local pelo do banco
        user = { ...user, ...data.user, id: data.user.id };
      } else {
        console.warn('Gravação em banco falhou, mantendo em memória', data.error);
      }
    } catch(err) {
      console.warn('API DB inacessível, mantendo em memória local', err);
    }

    __dbUsers.push(user);
    save(KEYS.users, __dbUsers);
    return user;
  }
  async function updateUser(id, updates) {
    const idx = __dbUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    __dbUsers[idx] = { ...__dbUsers[idx], ...updates };
    
    try {
      const resp = await fetch('/api/db/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
      const data = await resp.json();
      if (data.success && data.user) {
        __dbUsers[idx] = {
          ...__dbUsers[idx],
          ...data.user,
          avatar: data.user.avatar || data.user.name.substring(0, 2).toUpperCase(),
        };
      } else if (data.error) {
        console.error('[Driver] updateUser API error:', data.error);
      }
    } catch(err) {
      console.warn('API DB inacessível na atualização de usuário.', err);
    }
    
    save(KEYS.users, __dbUsers);
    return __dbUsers[idx];
  }

  // ============================
  // ARTICLES
  // ============================
  function getArticles() { 
    return __dbArticles.map(a => {
      if (a.status === 'draft' && a.wasPublished) {
        a.status = 'hidden';
      }
      return a;
    }); 
  }
  function getArticleById(id) { return getArticles().find(a => a.id === id); }
  function getArticlesByAuthor(authorId) { return getArticles().filter(a => a.authorId === authorId && !a.deleted); }
  function getArticlesByStatus(status) { return getArticles().filter(a => a.status === status && !a.deleted); }
  function getPublishedByAuthor(authorId) { return getArticlesByAuthor(authorId).filter(a => a.status === 'published'); }
  function getPendingArticles() { return getArticles().filter(a => ['sent', 'review', 'approved'].includes(a.status) && !a.deleted); }
  function getMonthlyUsage(authorId) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    // Opcional de exclusão: contabilizar itens excluídos que não eram rascunhos puros (já consumiram crédito)
    return getArticles().filter(a => {
      if (a.authorId !== authorId) return false;
      // Se for rascunho PÚRO (nunca foi publicado), não consome a cota do mês.
      // Porém, se foi publicado e depois OCULTADO (wasPublished: true), a IA/credito já foi consumida.
      if (a.status === 'draft' && !a.wasPublished) return false;
      
      const dt = a.publishedAt || a.submittedAt;
      if (!dt) return false;
      const d = new Date(dt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
  }
  function getRemainingArticles(userId) {
    const user = getUserById(userId);
    if (!user) return 0;
    const limit = PLAN_LIMITS[user.plan] || 0;
    const used = getMonthlyUsage(userId);
    return Math.max(0, limit - used);
  }

  async function addArticle(article) {
    article.id = 'a' + (__dbArticles.length + 1) + '_' + Date.now(); // Fallback gen for cache
    article.views = 0;
    
    // Tentativa de gravar no Supabase via API
    try {
      const resp = await fetch('/api/db/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      const data = await resp.json();
      if (data.success && data.article) {
        article = { ...article, ...data.article, id: data.article.id };
      }
    } catch(err) {
      console.warn('API DB inacessível, mantendo em memória local', err);
    }
    
    __dbArticles.push(article);
    save(KEYS.articles, __dbArticles);
    return article;
  }

  async function updateArticle(id, updates) {
    let idx = __dbArticles.findIndex(a => a.id === id);
    
    // ATUALIZAR no Supabase via API de forma direta para evitar race condition
    try {
      const resp = await fetch('/api/db/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
      const data = await resp.json();
      if (data.success && data.article) {
        if (idx !== -1) {
          __dbArticles[idx] = { ...__dbArticles[idx], ...data.article, id: data.article.id };
        } else {
          // It existed in the database but our local array hadn't fetched it yet. Add it now!
          __dbArticles.push({
            ...data.article,
            authorId: data.article.author_id,
            publishedAt: data.article.published_at,
            submittedAt: data.article.submitted_at
          });
          idx = __dbArticles.length - 1;
        }
      } else {
        if (idx === -1) return null;
      }
    } catch(err) {
      console.warn('API DB inacessível na atualização, mantendo local se existir.', err);
      if (idx === -1) return null;
    }

    if (idx !== -1) {
      if (__dbArticles[idx].deleted) {
         // Opcional: remover lógicamente
         __dbArticles[idx].deleted = true;
      }
      save(KEYS.articles, __dbArticles);
      return __dbArticles[idx];
    }
    return null;
  }

  async function changeArticleStatus(id, newStatus) {
    const updates = { status: newStatus };
    if (newStatus === 'published') updates.publishedAt = new Date().toISOString().split('T')[0];
    if (newStatus === 'sent') updates.submittedAt = new Date().toISOString().split('T')[0];
    
    // Slugs requirement Step 4.2
    if (newStatus === 'published') {
      try { fetch('/api/ping-google', { method: 'POST' }); } catch(err){}
    }

    return await updateArticle(id, updates);
  }

  async function deleteArticle(id) {
    return await updateArticle(id, { deleted: true });
  }

  // ============================
  // SESSION (current logged in user)
  // ============================
  async function login(email, pass) { 
    // 1) Tenta autenticação real via API (valida hash de senha no servidor)
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await resp.json();
      if (data.success && data.user) {
        // Atualiza cache local com dados do banco
        const idx = __dbUsers.findIndex(u => u.email === email);
        if (idx >= 0) { __dbUsers[idx] = { ...__dbUsers[idx], ...data.user }; }
        else { __dbUsers.push(data.user); }
        save(KEYS.users, __dbUsers);
        save(KEYS.session, { userId: data.user.id, loggedAt: Date.now() });
        return data.user;
      }
    } catch(err) {
      console.warn('API login inacessível, tentando fallback local', err);
    }
    // 2) Fallback: busca local (apenas para desenvolvimento/localhost)
    const localUser = __dbUsers.find(u => u.email === email);
    if (localUser) {
      save(KEYS.session, { userId: localUser.id, loggedAt: Date.now() });
      return localUser;
    }
    return null;
  }
  function forceLoginById(userId) { save(KEYS.session, { userId, loggedAt: Date.now() }); }
  function logout() { localStorage.removeItem(KEYS.session); }
  function getSession() { return load(KEYS.session, null); }
  function getCurrentUser() {
    const session = getSession();
    return session ? getUserById(session.userId) : null;
  }
  function isLoggedIn() { return !!getSession(); }

  // ============================
  // SETTINGS
  // ============================
  function getSettings() { return load(KEYS.settings, typeof SEED_SETTINGS !== 'undefined' ? SEED_SETTINGS : {}); }
  function updateSetting(key, value) {
    const s = getSettings();
    s[key] = value;
    save(KEYS.settings, s);
    return s;
  }

  // ============================
  // STATS (computed)
  // ============================
  function getAdminStats() {
    const users = getUsers();
    const articles = getArticles();
    const pilots = users.filter(u => u.type === 'piloto' && u.is_active);
    const teams = users.filter(u => u.type === 'equipe' && u.is_active);
    const cats = users.filter(u => u.type === 'categoria' && u.is_active);
    const totalActive = pilots.length + teams.length + cats.length;
    const pending = articles.filter(a => ['sent', 'review', 'approved'].includes(a.status) && !a.deleted).length;
    const totalViews = articles.filter(a => !a.deleted).reduce((s, a) => s + (a.views || 0), 0);

    // Revenue calculation
    let revenue = 0;
    pilots.forEach(p => { revenue += p.plan === 'pro' ? 149.90 : 99.90; });
    teams.forEach(() => { revenue += 499.90; });
    cats.forEach(() => { revenue += 999.90; });

    return {
      revenue: revenue.toFixed(2),
      revenueFormatted: 'R$ ' + (revenue / 1000).toFixed(1) + 'K',
      totalActive,
      pilotsCount: pilots.length,
      teamsCount: teams.length,
      categoriesCount: cats.length,
      pendingArticles: pending,
      totalViews,
      totalViewsFormatted: totalViews > 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews.toString(),
    };
  }

  function getUserStats(userId) {
    const articles = getArticlesByAuthor(userId);
    const published = articles.filter(a => a.status === 'published');
    const totalViews = published.reduce((s, a) => s + (a.views || 0), 0);
    return {
      totalPublished: published.length,
      totalViews,
      totalViewsFormatted: totalViews > 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews.toString(),
      remaining: getRemainingArticles(userId),
      limit: PLAN_LIMITS[getUserById(userId) ? getUserById(userId).plan : 'starter'] || 0,
    };
  }

  // ============================
  // HELPERS
  // ============================
  function generateId() { return Math.random().toString(36).substr(2, 9); }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }
  function getStatusLabel(status) { return STATUS_LABELS[status] || status; }
  function getStatusCSS(status) { return STATUS_CSS[status] || ''; }
  function getPlanName(plan) { return PLAN_NAMES[plan] || plan; }
  function getPlanPrice(plan) { return PLAN_PRICES[plan] || ''; }

  // ============================
  // INIT on load
  // ============================
  init();

  // ============================
  // LIVE DATA API (F1 + News)
  // ============================
  const Live = (() => {
    const CACHE_MINUTES = 15;

    async function fetchWithCache(url, cacheKey) {
      const cached = load(cacheKey, null);
      if (cached && Date.now() - cached.timestamp < CACHE_MINUTES * 60000) {
        return cached.data;
      }
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('API Error');
        const data = await resp.json();
        save(cacheKey, { timestamp: Date.now(), data });
        return data;
      } catch (e) {
        console.error('Failed to fetch', url, e);
        return cached ? cached.data : null;
      }
    }

    async function getDriverStandings() {
      const data = await fetchWithCache('https://api.jolpi.ca/ergast/f1/current/driverStandings.json', 'pl_live_drivers');
      if (!data) return [];
      try {
        return data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      } catch(e) { return []; }
    }

    async function getConstructorStandings() {
      const data = await fetchWithCache('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json', 'pl_live_constructors');
      if (!data) return [];
      try {
        return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      } catch(e) { return []; }
    }

    async function getNextRace() {
      const data = await fetchWithCache('https://api.jolpi.ca/ergast/f1/current/next.json', 'pl_live_nextrace');
      if (!data) return null;
      try {
        return data.MRData.RaceTable.Races[0];
      } catch(e) { return null; }
    }

    async function getNews() {
      const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.grandepremio.com.br/f1/feed/';
      const data = await fetchWithCache(url, 'pl_live_news');
      if (!data) return [];
      try {
        return data.items.map(item => ({
          title: item.title,
          link: item.link,
          thumbnail: item.thumbnail || 'https://loremflickr.com/760/320/formula1?lock=' + Math.floor(Math.random()*100),
          pubDate: item.pubDate,
          author: item.author || 'Grande Prêmio',
          categories: item.categories || ['F1']
        }));
      } catch(e) { return []; }
    }

    async function getNewsByCategory(catName) {
      const urls = {
        'f1': [
          'https://www.grandepremio.com.br/f1/feed/',
          'https://br.motorsport.com/rss/f1/news/'
        ],
        'motogp': [
          'https://www.grandepremio.com.br/motogp/feed/',
          'https://br.motorsport.com/rss/motogp/news/'
        ],
        'wec': ['https://br.motorsport.com/rss/wec/news/'],
        'nascar': ['https://br.motorsport.com/rss/nascar-cup/news/'],
        'wrc': ['https://br.motorsport.com/rss/wrc/news/'],
        'stock-car': ['https://www.grandepremio.com.br/stock-car/feed/']
      };
      const feedUrls = urls[catName] || urls['f1'];
      const today = new Date().toISOString().slice(0,10);
      const seenTitles = new Set();
      let allItems = [];
      
      for (const feedUrl of feedUrls) {
        const fetchUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + feedUrl;
        const data = await fetchWithCache(fetchUrl, 'pl_live_news_' + catName + '_' + feedUrl.split('/')[2]);
        if (!data || !data.items) continue;
        data.items.forEach(item => {
          // Filtro: apenas noticias de hoje
          const pubDate = (item.pubDate || '').slice(0,10);
          if (pubDate !== today) return;
          // Deduplicacao
          const titleClean = item.title.trim().toLowerCase().slice(0,60);
          if (seenTitles.has(titleClean)) return;
          seenTitles.add(titleClean);
          
          allItems.push({
            title: item.title,
            link: item.link,
            thumbnail: item.thumbnail || (item.enclosure ? item.enclosure.url : '') || 'https://upload.wikimedia.org/wikipedia/commons/3/3f/FIA_F1_Austria_2023_Nr._44_%282%29.jpg',
            pubDate: item.pubDate,
            author: feedUrl.includes('grandepremio') ? 'Grande Premio' : (feedUrl.includes('br.motorsport') ? 'Motorsport BR' : 'Motorsport.com'),
            categories: item.categories || [catName.toUpperCase()]
          });
        });
      }
      return allItems;
    }

    return { getDriverStandings, getConstructorStandings, getNextRace, getNews, getNewsByCategory };
  })();

  // ============================
  // PUBLIC API
  // ============================
  return {
    init, reset, bootSupabase,
    RACING_CATEGORIES,
    getUsers, getUserById, getUsersByType, addUser, updateUser,
    // Articles
    getArticles, getArticleById, getArticlesByAuthor, getArticlesByStatus,
    getPublishedByAuthor, getPendingArticles, getMonthlyUsage, getRemainingArticles,
    addArticle, updateArticle, changeArticleStatus, deleteArticle,
    // Session
    login, forceLoginById, logout, getSession, getCurrentUser, isLoggedIn,
    // Settings
    getSettings, updateSetting,
    // Stats
    getAdminStats, getUserStats,
    // Helpers
    formatDate, getStatusLabel, getStatusCSS, getPlanName, getPlanPrice,
    PLAN_LIMITS, PLAN_NAMES, PLAN_PRICES, STATUS_LABELS, STATUS_CSS,
    // Live Modules
    Live,
    // System
    reset, init, bootSupabase,
  };
})();
