import re

with open('public/js/app.js', 'r') as f:
    content = f.read()

# 1. Remove HERO_DATA
content = re.sub(r'/\* ══ HERO_DATA.*?\};\s*', '', content, flags=re.DOTALL)

# 2. Remove updateHero
content = re.sub(r'/\* ══ updateHero.*?\}\n', '', content, flags=re.DOTALL)

# 3. Update filterCat
filter_cat_repl = """function filterCat(cat){
  currentCat=cat;applyFilter();
  document.getElementById('newsSectionTitle').textContent=cat==='all'?'Últimas Notícias':'Notícias · '+cat.toUpperCase();
  // Update standings to match category
  const champCat=CHAMP_DATA[cat]?cat:'f1';
  updateStandings(champCat);
  const champSec = document.getElementById('champSection');
  if(champSec) champSec.style.display = (cat === 'all' || cat === 'sim') ? 'none' : '';
  
  // Re-render hero dynamically based on category
  renderHeroGrid(cat);
}"""
content = re.sub(r'function filterCat\(cat\)\{.*?\n\}', filter_cat_repl, content, flags=re.DOTALL)

# 4. Update renderHeroGrid
render_hero_repl = """function renderHeroGrid(catFilter = 'all') {
  const grid = document.getElementById('heroGrid');
  const wrap = document.querySelector('.hero-wrap');
  if (!grid || ARTICLES.length < 3) return;

  let a0, a1, a2;

  if (catFilter === 'all') {
    if (wrap) wrap.style.display = '';
    const carNews = ARTICLES.find(a => ['f1', 'stock-car', 'wec', 'indycar', 'nascar'].includes(a.cat)) || ARTICLES[0];
    const motoNews = ARTICLES.find(a => a.cat === 'motogp' && a.id !== carNews?.id) || ARTICLES.find(a => a.id !== carNews?.id) || ARTICLES[1];
    
    const pilotNews = {
      id: 9999,
      cat: 'f4-brasil',
      badge: 'b-f4-brasil',
      title: 'Rafael Moura Vence na F4 Brasil e Atrai Interesse de Equipes Europeias',
      link: '#',
      author: 'PitLane',
      date: 'há 2h',
      img: 'img/demo-news-img.png',
      isReal: false
    };

    a0 = carNews; a1 = pilotNews; a2 = motoNews;
  } else {
    // Exact category matching
    let catArts = ARTICLES.filter(a => a.cat === catFilter);
    // Aliases
    if(catFilter === 'wec') catArts = ARTICLES.filter(a => ['wec', 'endurance'].includes(a.cat));
    if(catFilter === 'stock-car') catArts = ARTICLES.filter(a => ['stock-car', 'stockcar'].includes(a.cat));
    
    // If not enough news for hero, just hide the hero entirely
    if (catArts.length < 3) {
      if (wrap) wrap.style.display = 'none';
      return;
    } else {
      if (wrap) wrap.style.display = '';
      a0 = catArts[0]; a1 = catArts[1]; a2 = catArts[2];
    }
  }

  if (!a0 || !a1 || !a2) {
    if (wrap) wrap.style.display = 'none';
    return;
  }

  const getClk = (a) => a.isReal === false ? `toast('Demonstração: Matéria exclusiva do piloto assinante!','info')` : `window.open('${a.link}','_blank')`;

  grid.innerHTML = `
    <div class="hero-main" onclick="${getClk(a0)}" style="position:relative;overflow:hidden;cursor:pointer">
      <img src="${a0.img}" alt="${a0.title}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.5) brightness(.4);transition:transform .6s">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,10,.98) 0%,rgba(3,3,10,.5) 40%,transparent 100%);z-index:1"></div>
      <div class="hero-content" style="position:absolute;bottom:0;left:0;right:0;padding:36px;z-index:2">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span class="news-card-cat ${getCatClass(a0.cat)}" style="position:static">${a0.cat.toUpperCase()}</span>
          <span style="font-family:var(--fm);font-size:10px;color:rgba(255,255,255,.4)">${a0.author}</span>
        </div>
        <h1 style="font-family:'Bebas Neue',sans-serif;font-size:52px;line-height:.96;color:#fff;margin:0 0 12px">${a0.title}</h1>
        <div style="font-family:var(--fm);font-size:11px;color:rgba(255,255,255,.35);display:flex;align-items:center;gap:8px">
          <span>${a0.date}</span>
          <span style="width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.2)"></span>
          <span>Acessar portal ↗</span>
        </div>
      </div>
    </div>
    <div class="hero-side" style="display:flex;flex-direction:column;gap:3px">
      <div class="side-card" onclick="${getClk(a1)}" style="flex:1;position:relative;overflow:hidden;cursor:pointer;background:var(--bg2)">
        <img src="${a1.img}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.4) brightness(.4);transition:transform .4s">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,10,.95) 0%,rgba(3,3,10,.2) 55%,transparent);z-index:1"></div>
        <div class="side-content" style="position:absolute;bottom:0;left:0;right:0;padding:16px 18px;z-index:2">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="news-card-cat ${getCatClass(a1.cat)}" style="position:static;font-size:8px;padding:3px 8px">${a1.cat.toUpperCase()}</span>
            <span style="font-family:var(--fm);font-size:9px;color:rgba(255,255,255,.4)">${a1.author}</span>
          </div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;text-transform:uppercase;line-height:1.15;color:#fff;margin-bottom:5px">${a1.title}</div>
          <div style="font-family:var(--fm);font-size:9px;color:rgba(255,255,255,.3)">${a1.date} · Acessar ↗</div>
        </div>
      </div>
      <div class="side-card" onclick="${getClk(a2)}" style="flex:1;position:relative;overflow:hidden;cursor:pointer;background:var(--bg2)">
        <img src="${a2.img}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.4) brightness(.4);transition:transform .4s">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,10,.95) 0%,rgba(3,3,10,.2) 55%,transparent);z-index:1"></div>
        <div class="side-content" style="position:absolute;bottom:0;left:0;right:0;padding:16px 18px;z-index:2">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="news-card-cat ${getCatClass(a2.cat)}" style="position:static;font-size:8px;padding:3px 8px">${a2.cat.toUpperCase()}</span>
            <span style="font-family:var(--fm);font-size:9px;color:rgba(255,255,255,.4)">${a2.author}</span>
          </div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;text-transform:uppercase;line-height:1.15;color:#fff;margin-bottom:5px">${a2.title}</div>
          <div style="font-family:var(--fm);font-size:9px;color:rgba(255,255,255,.3)">${a2.date} · Acessar ↗</div>
        </div>
      </div>
    </div>
  `;
}"""
content = re.sub(r'function renderHeroGrid\(.*?\)\s*\{.*?\}\s*(?=function renderNewsGrid)', render_hero_repl + '\n\n', content, flags=re.DOTALL)

with open('public/js/app.js', 'w') as f:
    f.write(content)

print("Fixed logic fully in python!")
