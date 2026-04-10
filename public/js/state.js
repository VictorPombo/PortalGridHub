/* =====================================================
   PITLANE NEWS — SHARED STATE MANAGEMENT
   All pages use this as the single source of truth.
   Data is persisted to localStorage.
   ===================================================== */

const PitLane = (() => {
  const KEYS = {
    users: 'pl_users',
    articles: 'pl_articles',
    session: 'pl_session',
    stats: 'pl_stats',
    settings: 'pl_settings',
  };

  // ============================
  // DEFAULT SEED DATA
  // ============================
  const SEED_USERS = [
    { id: 'u1', name: 'Rafael Mendes', email: 'rafael@mendes.com', type: 'piloto', plan: 'pro', number: '07', category: 'Stock Car', avatar: 'RM', bio: 'Rafael Mendes é um dos pilotos mais talentosos da sua geração no automobilismo brasileiro. Nascido em Campinas, SP, em 1997, começou no kart aos 8 anos.', instagram: '@rafaelmendes07', youtube: 'youtube.com/rafaelmendes', flag: '🇧🇷', conquests: { titles: 3, wins: 12, podiums: 48, poles: 7, fastlaps: 9 }, social: { ig: '@rafaelmendes07', yt: 'youtube.com/rafaelmendes', x: '@rmendes07' }, createdAt: '2026-01-15', status: 'active' },
    { id: 'u2', name: 'Lucas Andrade', email: 'lucas@andrade.com', type: 'piloto', plan: 'starter', number: '22', category: 'F4 Brasil', avatar: 'LA', bio: 'Jovem promessa do automobilismo paulista.', flag: '🇧🇷', conquests: { titles: 1, wins: 5, podiums: 18 }, createdAt: '2026-02-10', status: 'active' },
    { id: 'u3', name: 'Camila Torres', email: 'camila@torres.com', type: 'piloto', plan: 'starter', number: '33', category: 'Porsche Cup', avatar: 'CT', bio: 'Primeira mulher a vencer na Porsche Cup Brasil.', flag: '🇧🇷', conquests: { titles: 2, wins: 7, podiums: 24 }, createdAt: '2026-02-20', status: 'active' },
    { id: 'u4', name: 'Pedro Silva', email: 'pedro@silva.com', type: 'piloto', plan: 'pro', number: '88', category: 'Sim Racing', avatar: 'PS', bio: 'Piloto virtual profissional de iRacing.', flag: '🇧🇷', conquests: { titles: 4, wins: 31, podiums: 67 }, createdAt: '2026-03-05', status: 'active' },
    { id: 'u5', name: 'Thunder Racing', email: 'contato@thunderracing.com', type: 'equipe', plan: 'equipe', avatar: 'TR', category: 'Stock Car', bio: 'Equipe de automobilismo fundada em 2018, atuando na Stock Car Brasil com 4 pilotos profissionais.', pilots: ['u1', 'u2', 'u3', 'u4'], createdAt: '2026-01-10', status: 'active' },
    { id: 'u6', name: 'Stock Car Brasil', email: 'midia@stockcar.com.br', type: 'categoria', plan: 'categoria', avatar: 'SC', category: 'Stock Car', bio: 'A principal categoria do automobilismo brasileiro, com mais de 40 anos de história.', createdAt: '2025-12-01', status: 'active' },
    { id: 'u7', name: 'Full Throttle Racing', email: 'contato@fullthrottle.com', type: 'equipe', plan: 'equipe', avatar: 'FX', category: 'Stock Car', pilots: [], createdAt: '2026-02-15', status: 'active' },
    { id: 'u8', name: 'Apex Engineering', email: 'contato@apex.com', type: 'equipe', plan: 'equipe', avatar: 'AE', category: 'Stock Car', pilots: [], createdAt: '2026-03-01', status: 'active' },
  ];

  const SEED_ARTICLES = [
    { id: 'a1', authorId: 'u1', title: 'Equipe Thunder Racing oficializa novo patrocinador master para o Campeonato Paulista', brief: 'Nova parceria garante investimento crucial para a disputa do título na F1600.', body: '<p>Hoje é um dia especial para a Thunder Racing! Assinamos oficialmente o contrato com nosso novo patrocinador master para a temporada completa do Campeonato Paulista de F1600. Esse apoio reflete o compromisso com o desenvolvimento de pilotos locais.</p>', img: 'https://loremflickr.com/760/320/racing,sponsor?lock=100', status: 'published', publishedAt: '2026-04-10', views: 2340, category: 'Stock Car' },
    { id: 'a2', authorId: 'u2', title: 'Vitória épica! Lucas Andrade larga em 5º e ganha a corrida em Interlagos', brief: 'Piloto paulista escala o grid sob forte chuva e conquista o lugar mais alto do pódio.', body: '<p>Que corrida inesquecível! Uma prova que exigiu tudo na pista molhada. Escalar o pelotão em Interlagos é sempre um desafio, e essa vitória nos coloca vivos na disputa do campeonato!</p>', img: 'https://loremflickr.com/760/320/interlagos,podium?lock=101', status: 'published', publishedAt: '2026-04-09', views: 1890, category: 'F4 Brasil' },
    { id: 'a3', authorId: 'u5', title: 'Thunder Racing faz a festa com 2 pilotos no pódio da etapa de Cascavel', brief: 'Final de semana dominante para nossa esquadra com P2 e P3 confirmados.', body: '<p>A equipe fez um trabalho fenomenal nos pits! Levar dois carros para o pódio na mesma etapa num grid super competitivo como este mostra a força da nossa garagem.</p>', img: 'https://loremflickr.com/760/320/pitcrew,celebration?lock=110', status: 'review', submittedAt: '2026-04-09', views: 0, category: 'Stock Car' },
    { id: 'a4', authorId: 'u4', title: 'Apex Engineering abre programa de Sim Racing para selecionar pilotos reais', brief: 'Os pilotos virtuais mais rápidos ganharão testes num carro de fórmula.', body: '', img: '', status: 'draft', views: 0, category: 'Sim Racing' },
    { id: 'a5', authorId: 'u6', title: 'MUDANÇAS NO REGULAMENTO: Categoria F4 anuncia novidades e teto de gastos', brief: 'Focada em equilibrar os times menores com as grandes estruturas.', body: '<p>Com o objetivo de revelar novos talentos, a comissão da F4 anunciou as reformas estruturais para a próxima temporada de forma a atrair novas equipes regionais ao grid nacional.</p>', img: 'https://loremflickr.com/760/320/documents,rules?lock=202', status: 'approved', submittedAt: '2026-04-08', views: 4120, category: 'F4 Brasil' },
    { id: 'a6', authorId: 'u3', title: 'Camila Torres fecha acordo para disputar endurance', brief: 'A pilota da Porsche Cup fará rodada dupla nos 500km de São Paulo.', body: '<p>Depois da Porsche Cup, o novo passo será encarar as longas durações dividindo o cockpit.</p>', img: 'https://loremflickr.com/760/320/helmet,driver?lock=203', status: 'published', publishedAt: '2026-04-03', views: 3480, category: 'Porsche Cup' },
    { id: 'a7', authorId: 'u3', title: 'Preparação física pré-campeonato', brief: 'Rotina de treinos pesada para suportar a força G.', body: '', img: '', status: 'sent', submittedAt: '2026-04-10', views: 0, category: 'Porsche Cup' },
    { id: 'a8', authorId: 'u5', title: 'Etapa cancelada e reagendada', brief: 'Fortes chuvas no interior alteram nosso cronograma logístico.', body: '', img: '', status: 'review', submittedAt: '2026-04-10', views: 0, category: 'Stock Car' },
    { id: 'a9', authorId: 'u8', title: 'Apex revela sua pintura azul metálica para 2026', brief: 'Carros vão para a pista com um visual limpo em parceria com novo fornecedor lubrificante.', body: '<p>O carro 88 ficou espetacular para as câmeras.</p>', img: 'https://loremflickr.com/760/320/racecar,livery?lock=210', status: 'published', publishedAt: '2026-04-08', views: 12340, category: 'Stock Car' },
    { id: 'a10', authorId: 'u6', title: 'Campeonato Paulista de Automobilismo abre inscrições p/ Kart', brief: 'O grid da federação espera recorde de participantes amadores.', body: '<p>Chamando as promessas da modalidade!</p>', img: 'https://loremflickr.com/760/320/karting,grid?lock=211', status: 'published', publishedAt: '2026-04-07', views: 8960, category: 'Stock Car' },
  ];

  const SEED_SETTINGS = {
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
  // PERSISTENCE
  // ============================
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function init() {
    if (!localStorage.getItem(KEYS.users)) save(KEYS.users, SEED_USERS);
    if (!localStorage.getItem(KEYS.articles)) save(KEYS.articles, SEED_ARTICLES);
    if (!localStorage.getItem(KEYS.settings)) save(KEYS.settings, SEED_SETTINGS);
  }

  function reset() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    init();
  }

  // ============================
  // USERS
  // ============================
  function getUsers() { return load(KEYS.users, SEED_USERS); }
  function getUserById(id) { return getUsers().find(u => u.id === id); }
  function getUsersByType(type) { return getUsers().filter(u => u.type === type); }
  function addUser(user) {
    const users = getUsers();
    user.id = 'u' + (users.length + 1) + '_' + Date.now();
    user.createdAt = new Date().toISOString().split('T')[0];
    user.status = 'active';
    user.avatar = user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    users.push(user);
    save(KEYS.users, users);
    return user;
  }
  function updateUser(id, updates) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    save(KEYS.users, users);
    return users[idx];
  }

  // ============================
  // ARTICLES
  // ============================
  function getArticles() { return load(KEYS.articles, SEED_ARTICLES); }
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

  function addArticle(article) {
    const articles = getArticles();
    article.id = 'a' + (articles.length + 1) + '_' + Date.now();
    article.views = 0;
    articles.push(article);
    save(KEYS.articles, articles);
    return article;
  }

  function updateArticle(id, updates) {
    const articles = getArticles();
    const idx = articles.findIndex(a => a.id === id);
    if (idx === -1) return null;
    articles[idx] = { ...articles[idx], ...updates };
    save(KEYS.articles, articles);
    return articles[idx];
  }

  function changeArticleStatus(id, newStatus) {
    const updates = { status: newStatus };
    if (newStatus === 'published') updates.publishedAt = new Date().toISOString().split('T')[0];
    if (newStatus === 'sent') updates.submittedAt = new Date().toISOString().split('T')[0];
    return updateArticle(id, updates);
  }

  // ============================
  // SESSION (current logged in user)
  // ============================
  function login(userId) { save(KEYS.session, { userId, loggedAt: Date.now() }); }
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

    return { getDriverStandings, getConstructorStandings, getNextRace, getNews };
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
    reset, init,
  };
})();
