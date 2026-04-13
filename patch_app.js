const fs = require('fs');

let appJs = fs.readFileSync('public/js/app.js', 'utf8');

// 1. Mudar const ARTICLES para let ARTICLES e limpar
appJs = appJs.replace(/const ARTICLES=\[[\s\S]*?\];/, 'let ARTICLES = [];');

// 2. Mudar const DRIVERS e CONSTRUCTORS para let para permitir atualização se quisermos depois (opcional)

// 3. Adicionar o loadLiveNews no final do arquivo
const newLogic = `
/* ══ DYNAMIC LIVE NEWS PIPELINE ══ */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.PitLane && typeof window.PitLane.bootSupabase === 'function') {
    try {
      await window.PitLane.bootSupabase();
    } catch(e) { console.error('Supabase boot fail', e); }
  }
  await loadLiveNews();
});

async function loadLiveNews() {
  let saasArticles = [];
  if (window.PitLane) {
    saasArticles = PitLane.getArticlesByStatus('published').map(a => {
      const u = PitLane.getUserById(a.author_id) || {};
      return {
        id: a.id,
        cat: a.category ? a.category.toLowerCase().replace(' ', '') : 'news',
        badge: a.category ? a.category : 'SAAS',
        kicker: u.role === 'equipe' ? 'EQUIPE OFICIAL' : 'PILOTO OFICIAL',
        title: a.title,
        author: u.full_name || 'Redação PitLane',
        av: 'PL',
        date: PitLane.formatDate(a.published_at || new Date()),
        img: a.image_url || ('https://loremflickr.com/760/320/racing?lock='+a.id),
        body: a.content || a.description || '',
        isReal: false
      };
    });
  }

  let rssArticles = [];
  try {
    const res = await fetch('/api/news');
    if (res.ok) {
      const { data } = await res.json();
      const pipelineFeed = [...(data.brasil || []), ...(data.global || [])];
      rssArticles = pipelineFeed.map((n, i) => {
        let cat = 'f1';
        let badge = 'f1';
        const cLower = (n.categories || []).join(' ').toLowerCase();
        if (cLower.includes('motogp')) { cat = 'motogp'; badge = 'motogp'; }
        else if (cLower.includes('wec') || cLower.includes('endurance')) { cat = 'wec'; badge = 'wec'; }
        else if (cLower.includes('nascar')) { cat = 'nascar'; badge = 'nascar'; }

        return {
          id: 'rss' + i,
          cat: cat,
          badge: badge,
          kicker: 'MERCADO / NOTÍCIAS',
          title: n.title,
          link: n.link,
          author: n.author || 'RSS Source',
          av: '📰',
          date: new Date(n.pubDate).toLocaleDateString('pt-BR'),
          img: n.thumbnail || 'https://loremflickr.com/400/260/racing,formula1?lock='+i,
          body: n.contentSnippet || '',
          isReal: true
        };
      });
    }
  } catch(e) { console.error('RSS fail', e); }

  const mixed = [];
  let rIdx = 0, sIdx = 0;
  while (rIdx < rssArticles.length || sIdx < saasArticles.length) {
    if (rIdx < rssArticles.length) mixed.push(rssArticles[rIdx++]);
    if (rIdx < rssArticles.length) mixed.push(rssArticles[rIdx++]);
    if (rIdx < rssArticles.length) mixed.push(rssArticles[rIdx++]);
    if (sIdx < saasArticles.length) mixed.push(saasArticles[sIdx++]);
  }

  ARTICLES = mixed;
  renderNewsGrid(mixed);
}

function renderNewsGrid(articles) {
  const grid = document.getElementById('cardGrid');
  if (!grid) return;
  grid.innerHTML = articles.map((a, i) => {
    const isExt = a.isReal;
    const clickAction = isExt ? \`extLink('\${a.link}')\` : \`openArticle('\${a.id}')\`;
    const tag = isExt ? \`<span class="tag-ext">🔗 \${a.author}</span>\` : \`<span class="tag-int">✍ PitLane News</span>\`;
    const dst = isExt ? \`<div class="ncard-dest ext">🔗 Abre \${a.author} em nova aba</div>\` : \`<div class="ncard-dest int">✍ Abre aqui no PitLane News</div>\`;
    const timeToRead = isExt ? 'AGORA' : '5 MIN';
    
    // First 2 articles are "feat" (highlighted)
    const isFeat = i < 2 ? 'feat' : '';
    
    return \`
      <div class="ncard \${isFeat} \${isExt?'is-ext':'is-int'} reveal in" data-cat="\${a.cat}" data-type="\${isExt?'ext':'int'}" data-id="\${a.id}" onclick="\${clickAction}" style="transition-delay: \${i*0.06}s">
        <div class="ncard-thumb">
          <img src="\${a.img}" alt="" loading="lazy">
          <div class="ncard-ribbon"><span class="badge b-\${a.cat}">\${a.badge.toUpperCase()}</span></div>
        </div>
        <div class="ncard-body">
          <div class="ncard-type-row">
            \${tag}
            <span style="font-family:var(--fm);font-size:9px;color:var(--muted)">\${isExt?'sai do site':'abre no portal'}</span>
          </div>
          <div class="ncard-title">\${a.title}</div>
          <div class="ncard-excerpt">\${a.body ? a.body.replace(/<[^>]*>?/gm, '').substring(0, 110) + '...' : ''}</div>
          <div class="ncard-footer">
            <span class="ncard-meta">\${a.date} · \${a.author.toUpperCase()} · \${timeToRead}</span>
            \${!isExt ? \`<button class="bm-btn" onclick="event.stopPropagation();bookmark(this,'\${a.id}')">🔖</button>\` : ''}
          </div>
        </div>
        \${dst}
      </div>
    \`;
  }).join('');
}
`;

appJs += newLogic;
fs.writeFileSync('public/js/app.js', appJs);
console.log('AppJS patched!');
