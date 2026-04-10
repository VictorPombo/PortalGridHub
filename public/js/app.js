/* ══ DATA ══ */
/* ── ARTIGOS ──
   Externos: redirecionam para URL real da fonte
   Internos/patrocinados: conteúdo editorial PitLane baseado em fatos reais */
let ARTICLES=[];

/* ── DADOS REAIS F1 2026 ──
   Pilotos: fonte SuperSport / GPFans / formula1.com — após 3 GPs (AUS, CHN, JAP)
   Construtores: fonte GPFans — após GP do Japão (29/03/2026)
   Vencedores: AUS→Russell, CHN→Antonelli, JAP→Antonelli  */
const DRIVERS=[
  {pos:1,cls:'p1',flag:'🇮🇹',name:'Antonelli',team:'Mercedes-AMG Petronas',pts:72,pct:100,color:'#00d2be'},
  {pos:2,cls:'p2',flag:'🇬🇧',name:'Russell',team:'Mercedes-AMG Petronas',pts:63,pct:88,color:'#00d2be'},
  {pos:3,cls:'p3',flag:'🇲🇨',name:'Leclerc',team:'Scuderia Ferrari',pts:49,pct:68,color:'#dc0000'},
  {pos:4,cls:'',flag:'🇬🇧',name:'Hamilton',team:'Scuderia Ferrari',pts:41,pct:57,color:'#dc0000'},
  {pos:5,cls:'',flag:'🇬🇧',name:'Norris',team:'McLaren Mercedes',pts:25,pct:35,color:'#ff8000'},
  {pos:6,cls:'',flag:'🇦🇺',name:'Piastri',team:'McLaren Mercedes',pts:21,pct:29,color:'#ff8000'},
  {pos:7,cls:'',flag:'🇬🇧',name:'Bearman',team:'MoneyGram Haas',pts:17,pct:24,color:'#aaaaaa'},
  {pos:8,cls:'',flag:'🇫🇷',name:'Gasly',team:'BWT Alpine',pts:15,pct:21,color:'#0093cc'},
  {pos:9,cls:'',flag:'🇳🇱',name:'Verstappen',team:'Red Bull Ford',pts:12,pct:17,color:'var(--acc)'},
  {pos:10,cls:'',flag:'🇳🇿',name:'Lawson',team:'Racing Bulls Ford',pts:10,pct:14,color:'#4e7cbf'},
];
const CONSTRUCTORS=[
  {pos:1,cls:'p1',flag:'🇩🇪',name:'Mercedes-AMG',team:'Mercedes',pts:135,pct:100,color:'#00d2be'},
  {pos:2,cls:'p2',flag:'🇮🇹',name:'Scuderia Ferrari',team:'Ferrari',pts:90,pct:67,color:'#dc0000'},
  {pos:3,cls:'p3',flag:'🇬🇧',name:'McLaren',team:'Mercedes',pts:46,pct:34,color:'#ff8000'},
  {pos:4,cls:'',flag:'🇺🇸',name:'MoneyGram Haas',team:'Ferrari',pts:18,pct:13,color:'#aaaaaa'},
  {pos:5,cls:'',flag:'🇫🇷',name:'BWT Alpine',team:'Mercedes',pts:16,pct:12,color:'#0093cc'},
  {pos:6,cls:'',flag:'🇦🇹',name:'Red Bull Racing',team:'Ford RBP',pts:16,pct:12,color:'var(--acc)'},
  {pos:7,cls:'',flag:'🇮🇹',name:'Racing Bulls',team:'Ford RBP',pts:14,pct:10,color:'#4e7cbf'},
  {pos:8,cls:'',flag:'🇩🇪',name:'Audi',team:'Audi',pts:2,pct:1,color:'#c0c0c0'},
];
const PILOTS=[
  {id:0,name:'Rafael Moura',cats:'F4 Brasil · Stock Car Light',plan:'Intermediário',wins:3,podios:8,img:'https://loremflickr.com/400/280/racing,driver?lock=14'},
  {id:1,name:'Ana Torres',cats:'F4 Brasil',plan:'Básico',wins:1,podios:3,img:'https://loremflickr.com/400/280/woman,driver?lock=22'},
  {id:2,name:'Bruno Castilho',cats:'TCR Brasil · Copa Hyundai',plan:'Intermediário',wins:5,podios:12,img:'https://loremflickr.com/400/280/motorsport,man?lock=31'},
  {id:3,name:'Carla Mendes',cats:'Fórmula Delta · F4 Brasil',plan:'Básico',wins:0,podios:2,img:'https://loremflickr.com/400/280/sport,woman?lock=42'},
];

/* ══ VIEW ROUTER ══ */
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const el=document.getElementById('view-'+id);
  if(el){el.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}
  // init views
  if(id==='pilots-list')renderPilotsList();
  if(id==='teams-list')renderTeamsList();
  if(id==='portal')renderPilotsHighlight();
}

/* ══ NAV ══ */
function setNavActive(el){
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  if(el)el.classList.add('active');
}

/* ══ MOBILE MENU ══ */
function openMob(){document.getElementById('mobMenu').classList.add('open');document.getElementById('mobOverlay').classList.add('show');document.body.classList.add('locked')}
function closeMob(){document.getElementById('mobMenu').classList.remove('open');document.getElementById('mobOverlay').classList.remove('show');document.body.classList.remove('locked')}

/* ══ TOAST ══ */
function toast(msg,type='info'){
  const w=document.getElementById('toasts');
  const t=document.createElement('div');
  t.className='toast '+(type==='ok'?'ok':type==='err'?'err':'info');
  t.textContent=msg;w.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),350)},3200);
}

/* ══ OVERLAYS ══ */
function closeOverlay(id){document.getElementById(id).classList.remove('open');document.body.classList.remove('locked')}
function openO(id){document.getElementById(id).classList.add('open');document.body.classList.add('locked')}
function openSubscribeModal(){openO('subOverlay');setSubStep(1)}
function confirm2(title,msg,cb){
  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').textContent=msg;
  document.getElementById('confirmBtn').onclick=()=>{cb();closeOverlay('confirmOverlay')};
  openO('confirmOverlay');
}

/* ══ SUBSCRIBE ══ */
function setSubStep(n){
  document.querySelectorAll('.sub-step').forEach((s,i)=>s.classList.toggle('active',i+1===n));
  document.getElementById('subProg').style.width=(n===3?100:n===2?66:33)+'%';
}
function subNext(step){
  if(step===1){
    const e=document.getElementById('subEmail').value;
    const err=document.getElementById('subEmailErr');
    if(!isEmail(e)){document.getElementById('subEmail').style.borderColor='var(--acc)';err.classList.add('show');return}
    document.getElementById('subEmail').style.borderColor='';err.classList.remove('show');setSubStep(2);
  }else{setSubStep(3);toast('✓ Você está no grid!','ok')}
}

/* ══ ARTICLE MODAL ══ */
function openArticle(id){
  const a=ARTICLES.find(x=>x.id===id);if(!a)return;
  document.getElementById('artBreadcrumb').textContent='PITLANE NEWS · '+a.cat.toUpperCase();
  document.getElementById('artImg').src=a.img;
  const b=document.getElementById('artBadge');b.className='badge '+a.badge;b.textContent=a.badge.replace('b-','').toUpperCase();
  document.getElementById('artKicker').textContent=a.kicker;
  document.getElementById('artTitle').textContent=a.title;
  document.getElementById('artAv').textContent=a.av;
  document.getElementById('artAuthor').textContent=a.author;
  document.getElementById('artDate').textContent=a.date;
  document.getElementById('artText').innerHTML=a.body;
  const pn=document.getElementById('artPagoNotice');
  const sn=document.getElementById('artSourceNote');
  if(a.pago){
    pn.classList.remove('hide');
    document.getElementById('artPagoPartner').textContent=a.partner;
    sn.classList.remove('hide');sn.textContent='CONTEÚDO PATROCINADO';
  }else{pn.classList.add('hide');sn.classList.add('hide')}
  openO('artOverlay');
  document.getElementById('artOverlay').scrollTop=0;
}

/* ══ EXTERNAL LINK ══ */
function extLink(url){window.open(url,'_blank');toast('Abrindo fonte original em nova aba...','info')}

/* ══ SEARCH ══ */
function openSearch(){openO('searchOverlay');setTimeout(()=>document.getElementById('searchField').focus(),80);renderSearch('')}
function searchBy(q){document.getElementById('searchField').value=q;renderSearch(q)}
function renderSearch(q){
  const w=document.getElementById('searchResults');
  if(!q.trim()){w.innerHTML='';return}
  const r=ARTICLES.filter(a=>a.title.toLowerCase().includes(q.toLowerCase())||a.cat.includes(q.toLowerCase())||a.author.toLowerCase().includes(q.toLowerCase()));
  if(!r.length){w.innerHTML='<div class="search-empty">Nenhum resultado para "'+q+'"</div>';return}
  w.innerHTML=r.map(a=>`<div class="sr-item" onclick="closeOverlay('searchOverlay');openArticle(${a.id})">
    <img class="sr-img" src="${a.img}" alt="">
    <div><div class="sr-title">${a.title}</div>
    <div class="sr-meta"><span class="badge ${a.badge}" style="font-size:8px">${a.cat.toUpperCase()}</span><span>${a.author}</span>${a.pago?'<span class="tag-pago" style="font-size:8px;padding:1px 6px">⭐ Patrocinado</span>':'<span class="tag-int" style="font-size:8px;padding:1px 6px">✍ PitLane</span>'}</div></div>
  </div>`).join('');
}
document.getElementById('searchField').addEventListener('input',e=>renderSearch(e.target.value));

/* ══ STANDINGS ══ */
function renderStand(data){
  document.getElementById('standTable').innerHTML='<tbody>'+data.map(r=>`<tr onclick="toast('${r.name} — ${r.pts} pts · ${r.team}','info')"><td class="s-pos ${r.cls}">${r.pos}</td><td class="s-flag">${r.flag}</td><td><div class="s-name">${r.name}</div><div class="s-team">${r.team}</div></td><td class="s-bar-c"><div class="s-bar-bg"><div class="s-bar" style="width:${r.pct}%;background:${r.color}"></div></div></td><td class="s-pts">${r.pts}</td></tr>`).join('')+'</tbody>';
}
function switchStand(el,tab){
  document.querySelectorAll('.s-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  renderStand(tab==='drv'?DRIVERS:CONSTRUCTORS);
}
renderStand(DRIVERS);

/* ══ COUNTDOWN — GP Miami 2026: Corrida Dom 03/05 às 21:00 UTC = 17:00 BRT ══ */
const RACE=new Date('2026-05-03T21:00:00Z');
function tick(){
  const d=RACE-new Date();
  if(d<=0){document.querySelector('.cd-grid').innerHTML='<div style="grid-column:span 4;text-align:center;padding:16px;font-family:var(--fm);font-size:11px;color:var(--acc)">🏁 CORRIDA EM ANDAMENTO</div>';return}
  document.getElementById('cd-d').textContent=pad(Math.floor(d/86400000));
  document.getElementById('cd-h').textContent=pad(Math.floor((d%86400000)/3600000));
  document.getElementById('cd-m').textContent=pad(Math.floor((d%3600000)/60000));
  document.getElementById('cd-s').textContent=pad(Math.floor((d%60000)/1000));
}
function pad(n){return String(n).padStart(2,'0')}
tick();setInterval(tick,1000);

/* ══ SCROLL ══ */
window.addEventListener('scroll',()=>{
  const s=document.documentElement;
  document.getElementById('pgbar').style.width=(s.scrollTop/(s.scrollHeight-window.innerHeight)*100)+'%';
  document.getElementById('btt').classList.toggle('vis',window.scrollY>500);
});

/* ══ REVEAL ══ */
const ro=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in')})},{threshold:.06});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
document.querySelectorAll('.ncard').forEach((c,i)=>{c.style.transitionDelay=(i*.06)+'s';c.classList.add('reveal');ro.observe(c)});

/* ══ FILTER ══ */
let currentCat='all',currentType='all';
function filterCat(cat){
  currentCat=cat;applyFilter();
  document.getElementById('newsSectionTitle').textContent=cat==='all'?'Últimas Notícias':'Categoria: '+cat.toUpperCase();
  document.getElementById('newsSection').scrollIntoView({behavior:'smooth',block:'start'});
}
function filterType(el,type){
  document.querySelectorAll('.ftag').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  currentType=type;applyFilter();
}
function applyFilter(){
  document.querySelectorAll('.ncard').forEach(c=>{
    const cat=c.dataset.cat,type=c.dataset.type;
    const catOk=currentCat==='all'||cat===currentCat;
    const typeOk=currentType==='all'||type===currentType;
    c.style.opacity=(catOk&&typeOk)?'1':'0.15';
    c.style.pointerEvents=(catOk&&typeOk)?'all':'none';
  });
}
function catAct(el){document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));el.classList.add('active')}

/* ══ PILOTS ══ */
function renderPilotsHighlight(){
  const g=document.getElementById('pilotsHighlight');if(!g)return;
  g.innerHTML=PILOTS.map(p=>`<div class="pcard" onclick="showView('pilot-profile')">
    <div class="pcard-cover"><img src="${p.img}" alt="" loading="lazy"></div>
    <div class="pcard-body">
      <div style="position:absolute;top:10px;right:10px"><span class="badge b-piloto" style="font-size:8px">✓ Verificado</span></div>
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-cats">${p.cats}</div>
      <div class="pcard-stats">
        <div class="pstat"><span class="pstat-n">${p.wins}</span><span class="pstat-l">Vitórias</span></div>
        <div class="pstat"><span class="pstat-n">${p.podios}</span><span class="pstat-l">Pódios</span></div>
        <div class="pstat"><span class="pstat-n" style="font-size:12px;color:var(--gold)">${p.plan}</span><span class="pstat-l">Plano</span></div>
      </div>
    </div>
  </div>`).join('');
}
function renderPilotsList(){
  const g=document.getElementById('pilotsListGrid');if(!g)return;
  g.innerHTML=PILOTS.map(p=>`<div class="pcard" onclick="showView('pilot-profile')">
    <div class="pcard-cover"><img src="${p.img}" alt="" loading="lazy"></div>
    <div class="pcard-body">
      <div style="position:absolute;top:10px;right:10px"><span class="badge b-piloto" style="font-size:8px">✓ Verificado</span></div>
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-cats">${p.cats}</div>
      <div class="pcard-stats">
        <div class="pstat"><span class="pstat-n">${p.wins}</span><span class="pstat-l">Vitórias</span></div>
        <div class="pstat"><span class="pstat-n">${p.podios}</span><span class="pstat-l">Pódios</span></div>
      </div>
      <button class="btn btn-acc btn-full btn-sm" style="margin-top:12px" onclick="event.stopPropagation();showView('pilot-profile')">Ver perfil →</button>
    </div>
  </div>`).join('');
}
function renderTeamsList(){
  const g=document.getElementById('teamsListGrid');if(!g)return;
  const teams=[
    {name:'Turbo Racing',cats:'Stock Car Light',img:'https://loremflickr.com/400/280/garage,racing?lock=81'},
    {name:'GT Brasil Team',cats:'TCR Brasil · Endurance',img:'https://loremflickr.com/400/280/motorsport,pit?lock=82'},
    {name:'Formula Norte',cats:'F4 Brasil · F3 Brasil',img:'https://loremflickr.com/400/280/formula,car?lock=83'},
  ];
  g.innerHTML=teams.map(t=>`<div class="pcard" onclick="toast('Abrindo página da equipe ${t.name}...','info')">
    <div class="pcard-cover"><img src="${t.img}" alt="" loading="lazy"></div>
    <div class="pcard-body">
      <div style="position:absolute;top:10px;right:10px"><span class="badge b-equipe" style="font-size:8px">Equipe</span></div>
      <div class="pcard-name">${t.name}</div>
      <div class="pcard-cats">${t.cats}</div>
      <button class="btn btn-acc btn-full btn-sm" style="margin-top:14px" onclick="event.stopPropagation();toast('Abrindo página da equipe...','info')">Ver página →</button>
    </div>
  </div>`).join('');
}
renderPilotsHighlight();

/* ══ PLANS TABS ══ */
function showPlanGroup(el,group){
  document.querySelectorAll('.plan-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  document.querySelectorAll('.plans-group').forEach(g=>g.classList.add('hide'));
  document.getElementById('plans-'+group).classList.remove('hide');
}

/* ══ DASH SECTIONS ══ */
function dashSection(id,navEl){
  const parent=document.getElementById(id).closest('.dash-main');
  if(parent)parent.querySelectorAll('[id]').forEach(el=>{if(el.id!==id)el.classList.add('hide')});
  document.getElementById(id).classList.remove('hide');
  if(navEl){const nav=navEl.closest('.dash-nav');if(nav){nav.querySelectorAll('a').forEach(a=>a.classList.remove('active'));navEl.classList.add('active')}}
}

/* ══ AUTH ══ */
function authTab(el,tab){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  document.getElementById('auth-login').classList.toggle('hide',tab!=='login');
  document.getElementById('auth-register').classList.toggle('hide',tab!=='register');
}
function doLogin(){
  const e=document.getElementById('loginEmail').value;
  const p=document.getElementById('loginPass').value;
  if(!e||!p){toast('Preencha e-mail e senha','err');return}
  toast('Verificando credenciais...','info');
  setTimeout(()=>{toast('Login realizado!','ok');showView('dash-piloto')},800);
}
function loginAs(type){
  const map={admin:'dash-admin',piloto:'dash-piloto',equipe:'dash-piloto',categoria:'dash-piloto'};
  toast('Entrando como '+type+'...','info');
  setTimeout(()=>showView(map[type]||'dash-piloto'),500);
}
function doLogout(){toast('Saindo...','info');setTimeout(()=>showView('portal'),500)}

/* ══ NEWSLETTER ══ */
function nlSubmit(){
  const i=document.getElementById('nlEmail');
  if(!isEmail(i.value)){i.style.borderColor='var(--acc)';toast('E-mail inválido','err');return}
  i.style.borderColor='';
  document.getElementById('nlWrap').innerHTML='<div style="font-family:var(--fu);font-size:16px;font-weight:700;letter-spacing:1px"><span style="color:var(--green)">✓</span> Você está no grid! Primeiro briefing amanhã às 8h.</div>';
  toast('✓ Inscrição confirmada!','ok');
}

/* ══ BOOKMARK ══ */
let bookmarks=JSON.parse(localStorage.getItem('pl_bm')||'[]');
function bookmark(btn,id){
  if(bookmarks.includes(id)){bookmarks=bookmarks.filter(x=>x!==id);btn.classList.remove('saved');toast('Removido dos salvos')}
  else{bookmarks.push(id);btn.classList.add('saved');toast('✓ Artigo salvo!','ok')}
  localStorage.setItem('pl_bm',JSON.stringify(bookmarks));
}
bookmarks.forEach(id=>document.querySelector(`.bm-btn[onclick*=",${id}"]`)?.classList.add('saved'));

/* ══ SHARE ══ */
function copyLink(){navigator.clipboard?.writeText(location.href).then(()=>toast('✓ Link copiado!','ok')).catch(()=>toast('✓ Link copiado!','ok'))}

/* ══ UTILS ══ */
function isEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}

/* ══ KEYBOARD ══ */
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openSearch()}
  if(e.key==='Escape'){
    ['searchOverlay','artOverlay','subOverlay','confirmOverlay'].forEach(id=>{
      const el=document.getElementById(id);if(el&&el.classList.contains('open'))closeOverlay(id);
    });
    closeMob();
  }
});

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
      const u = PitLane.getUserById(a.authorId) || {};
      return {
        id: a.id,
        cat: a.category ? a.category.toLowerCase().replace(' ', '') : 'news',
        badge: a.category ? a.category : 'SAAS',
        kicker: u.type === 'equipe' ? 'EQUIPE OFICIAL' : 'PILOTO OFICIAL',
        title: a.title,
        author: u.name || 'Redação PitLane',
        av: 'PL',
        date: PitLane.formatDate(a.publishedAt || new Date()),
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
          author: n.author || 'RSS Tracker',
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
    const clickAction = isExt ? `extLink('${a.link}')` : `openArticle('${a.id}')`;
    const tag = isExt ? `<span class="tag-ext">🔗 ${a.author}</span>` : `<span class="tag-int">✍ PitLane News</span>`;
    const dst = isExt ? `<div class="ncard-dest ext">🔗 Abre ${a.author} em nova aba</div>` : `<div class="ncard-dest int">✍ Abre aqui no PitLane News</div>`;
    const timeToRead = isExt ? 'AGORA' : '5 MIN';
    const isFeat = i < 2 ? 'feat' : '';
    
    return `
      <div class="ncard ${isFeat} ${isExt?'is-ext':'is-int'} reveal in" data-cat="${a.cat}" data-type="${isExt?'ext':'int'}" data-id="${a.id}" onclick="${clickAction}" style="transition-delay: ${i*0.06}s">
        <div class="ncard-thumb">
          <img src="${a.img}" alt="" loading="lazy">
          <div class="ncard-ribbon"><span class="badge b-${a.cat}">${a.badge.toUpperCase()}</span></div>
        </div>
        <div class="ncard-body">
          <div class="ncard-type-row">
            ${tag}
            <span style="font-family:var(--fm);font-size:9px;color:var(--muted)">${isExt?'sai do site':'abre no portal'}</span>
          </div>
          <div class="ncard-title">${a.title}</div>
          <div class="ncard-excerpt">${a.body ? a.body.replace(/<[^>]*>?/gm, '').substring(0, 110) + '...' : ''}</div>
          <div class="ncard-footer">
            <span class="ncard-meta">${a.date} · ${a.author.toUpperCase()} · ${timeToRead}</span>
            ${!isExt ? `<button class="bm-btn" onclick="event.stopPropagation();bookmark(this,'${a.id}')">🔖</button>` : ''}
          </div>
        </div>
        ${dst}
      </div>
    `;
  }).join('');
}