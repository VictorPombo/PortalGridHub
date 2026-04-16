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
  let __dbUsers = [];
  let __dbArticles = [];

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
    pro: 2,
    equipe: 10,
    categoria: 30,
  };

  const PLAN_NAMES = {
    starter: 'Piloto Starter',
    pro: 'Piloto Pro',
    equipe: 'Equipe',
    categoria: 'Categoria',
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
  };

  const STATUS_CSS = {
    draft: 'status-draft',
    sent: 'status-sent',
    review: 'status-review',
    adjust: 'status-adjust',
    approved: 'status-approved',
    published: 'status-published',
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
          avatar: u.avatar || u.name.substring(0, 2).toUpperCase()
        }));
        
        __dbArticles = data.articles.map(a => ({
          ...a,
          authorId: a.author_id,
          publishedAt: a.published_at,
          submittedAt: a.submitted_at
        }));
        console.log("[Driver] Supabase Boot Completo:", __dbArticles.length, "Notícias locais carregadas.");
      }
    } catch (err) {
      console.warn("[Driver] Boot Supabase falhou, usando arrays vazios.", err);
      // Fallback para não quebrar a UI
      __dbUsers = SEED_USERS || [];
      __dbArticles = SEED_ARTICLES || [];
    }
  }

  function load(key, defaultVal) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return defaultVal;
  }

  function save(key, data) {
    if(key === KEYS.settings) __dbSettings = data;
    else if(key === KEYS.users) __dbUsers = data;
    else if(key === KEYS.articles) __dbArticles = data;
    else {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch(e) {}
    }
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
    user.status = 'pending_payment';
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
        __dbUsers[idx] = { ...__dbUsers[idx], ...data.user };
      }
    } catch(err) {
      console.warn('API DB inacessível na atualização de usuário.', err);
    }
    
    return __dbUsers[idx];
  }

  // ============================
  // ARTICLES
  // ============================
  function getArticles() { return __dbArticles; }
  function getArticleById(id) { return getArticles().find(a => a.id === id); }
  function getArticlesByAuthor(authorId) { return getArticles().filter(a => a.authorId === authorId); }
  function getArticlesByStatus(status) { return getArticles().filter(a => a.status === status); }
  function getPublishedByAuthor(authorId) { return getArticlesByAuthor(authorId).filter(a => a.status === 'published'); }
  function getPendingArticles() { return getArticles().filter(a => ['sent', 'review', 'approved'].includes(a.status)); }
  function getMonthlyUsage(authorId) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return getArticlesByAuthor(authorId).filter(a => {
      if (a.status === 'draft') return false;
      const d = new Date(a.submittedAt || a.publishedAt);
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
    return article;
  }

  async function updateArticle(id, updates) {
    const idx = __dbArticles.findIndex(a => a.id === id);
    if (idx === -1) return null;
    __dbArticles[idx] = { ...__dbArticles[idx], ...updates };
    
    // ATUALIZAR no Supabase via API
    try {
      const resp = await fetch('/api/db/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
      const data = await resp.json();
      if (data.success && data.article) {
        __dbArticles[idx] = { ...__dbArticles[idx], ...data.article, id: data.article.id };
      }
    } catch(err) {
      console.warn('API DB inacessível na atualização, mantendo local.', err);
    }

    return __dbArticles[idx];
  }

  async function changeArticleStatus(id, newStatus) {
    const updates = { status: newStatus };
    if (newStatus === 'published') updates.publishedAt = new Date().toISOString().split('T')[0];
    if (newStatus === 'sent') updates.submittedAt = new Date().toISOString().split('T')[0];
    return await updateArticle(id, updates);
  }

  // ============================
  // SESSION (current logged in user)
  // ============================
  function login(userId, mockUser = null) { 
    save(KEYS.session, { userId, mockUser, loggedAt: Date.now() }); 
  }
  function logout() { localStorage.removeItem(KEYS.session); }
  function getSession() { return load(KEYS.session, null); }
  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const dbUser = getUserById(session.userId);
    return dbUser || session.mockUser || null;
  }
  function isLoggedIn() { return !!getSession(); }

  // ============================
  // SETTINGS
  // ============================
  function getSettings() { return load(KEYS.settings, SEED_SETTINGS); }
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
    const pilots = users.filter(u => u.type === 'piloto' && u.status === 'active');
    const teams = users.filter(u => u.type === 'equipe' && u.status === 'active');
    const cats = users.filter(u => u.type === 'categoria' && u.status === 'active');
    const totalActive = pilots.length + teams.length + cats.length;
    const pending = articles.filter(a => ['sent', 'review', 'approved'].includes(a.status)).length;
    const totalViews = articles.reduce((s, a) => s + (a.views || 0), 0);

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
      limit: PLAN_LIMITS[getUserById(userId)?.plan] || 0,
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
    // Users
    getUsers, getUserById, getUsersByType, addUser, updateUser,
    // Articles
    getArticles, getArticleById, getArticlesByAuthor, getArticlesByStatus,
    getPublishedByAuthor, getPendingArticles, getMonthlyUsage, getRemainingArticles,
    addArticle, updateArticle, changeArticleStatus,
    // Session
    login, logout, getSession, getCurrentUser, isLoggedIn,
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
