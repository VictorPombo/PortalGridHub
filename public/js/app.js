/* ══ DATA ══ */
/* ── ARTIGOS ──
   Externos: redirecionam para URL real da fonte
   Internos/patrocinados: conteúdo editorial Driver baseado em fatos reais */
let ARTICLES=[];

/* ── DADOS REAIS F1 2026 ──
   Pilotos: fonte SuperSport / GPFans / formula1.com — após 3 GPs (AUS, CHN, JAP)
   Construtores: fonte GPFans — após GP do Japão (29/03/2026)
   Vencedores: AUS→Russell, CHN→Antonelli, JAP→Antonelli  */
const CHAMP_DATA={
  f1:{
    title:'Campeonato F1 2026',
    season:'Após 3 GPs · Ronda 3 de 21',
    tabs:['Pilotos','Construtores'],
    drivers:[
      {pos:1,cls:'p1',flag:'\ud83c\uddee\ud83c\uddf9',name:'Antonelli',team:'Mercedes-AMG Petronas',pts:72,pct:100,color:'#00d2be'},
      {pos:2,cls:'p2',flag:'\ud83c\uddec\ud83c\udde7',name:'Russell',team:'Mercedes-AMG Petronas',pts:63,pct:88,color:'#00d2be'},
      {pos:3,cls:'p3',flag:'\ud83c\uddf2\ud83c\udde8',name:'Leclerc',team:'Scuderia Ferrari',pts:49,pct:68,color:'#dc0000'},
      {pos:4,cls:'',flag:'\ud83c\uddec\ud83c\udde7',name:'Hamilton',team:'Scuderia Ferrari',pts:41,pct:57,color:'#dc0000'},
      {pos:5,cls:'',flag:'\ud83c\uddec\ud83c\udde7',name:'Norris',team:'McLaren Mercedes',pts:25,pct:35,color:'#ff8000'},
      {pos:6,cls:'',flag:'\ud83c\udde6\ud83c\uddfa',name:'Piastri',team:'McLaren Mercedes',pts:21,pct:29,color:'#ff8000'},
      {pos:7,cls:'',flag:'\ud83c\uddec\ud83c\udde7',name:'Bearman',team:'MoneyGram Haas',pts:17,pct:24,color:'#aaaaaa'},
      {pos:8,cls:'',flag:'\ud83c\uddeb\ud83c\uddf7',name:'Gasly',team:'BWT Alpine',pts:15,pct:21,color:'#0093cc'},
      {pos:9,cls:'',flag:'\ud83c\uddf3\ud83c\uddf1',name:'Verstappen',team:'Red Bull Ford',pts:12,pct:17,color:'var(--acc)'},
      {pos:10,cls:'',flag:'\ud83c\uddf3\ud83c\uddff',name:'Lawson',team:'Racing Bulls Ford',pts:10,pct:14,color:'#4e7cbf'}
    ],
    constructors:[
      {pos:1,cls:'p1',flag:'\ud83c\udde9\ud83c\uddea',name:'Mercedes-AMG',team:'Mercedes',pts:135,pct:100,color:'#00d2be'},
      {pos:2,cls:'p2',flag:'\ud83c\uddee\ud83c\uddf9',name:'Scuderia Ferrari',team:'Ferrari',pts:90,pct:67,color:'#dc0000'},
      {pos:3,cls:'p3',flag:'\ud83c\uddec\ud83c\udde7',name:'McLaren',team:'Mercedes',pts:46,pct:34,color:'#ff8000'},
      {pos:4,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'MoneyGram Haas',team:'Ferrari',pts:18,pct:13,color:'#aaaaaa'},
      {pos:5,cls:'',flag:'\ud83c\uddeb\ud83c\uddf7',name:'BWT Alpine',team:'Mercedes',pts:16,pct:12,color:'#0093cc'},
      {pos:6,cls:'',flag:'\ud83c\udde6\ud83c\uddf9',name:'Red Bull Racing',team:'Ford RBP',pts:16,pct:12,color:'var(--acc)'},
      {pos:7,cls:'',flag:'\ud83c\uddee\ud83c\uddf9',name:'Racing Bulls',team:'Ford RBP',pts:14,pct:10,color:'#4e7cbf'},
      {pos:8,cls:'',flag:'\ud83c\udde9\ud83c\uddea',name:'Audi',team:'Audi',pts:2,pct:1,color:'#c0c0c0'}
    ]
  },
  motogp:{
    title:'Campeonato MotoGP 2026',
    season:'Após 3 GPs · Ronda 3 de 20',
    tabs:['Pilotos','Construtores'],
    drivers:[
      {pos:1,cls:'p1',flag:'\ud83c\uddee\ud83c\uddf9',name:'Bagnaia',team:'Ducati Lenovo Team',pts:81,pct:100,color:'#cc0000'},
      {pos:2,cls:'p2',flag:'\ud83c\uddea\ud83c\uddf8',name:'Marc M\u00e1rquez',team:'Gresini Racing',pts:75,pct:93,color:'#cc0000'},
      {pos:3,cls:'p3',flag:'\ud83c\uddea\ud83c\uddf8',name:'Mart\u00edn',team:'Aprilia Racing',pts:66,pct:81,color:'#be0000'},
      {pos:4,cls:'',flag:'\ud83c\uddee\ud83c\uddf9',name:'Bastianini',team:'KTM Factory',pts:52,pct:64,color:'#ff6600'},
      {pos:5,cls:'',flag:'\ud83c\uddea\ud83c\uddf8',name:'Acosta',team:'Tech3 GasGas',pts:45,pct:56,color:'#cc2200'},
      {pos:6,cls:'',flag:'\ud83c\uddf5\ud83c\uddf9',name:'Oliveira',team:'Trackhouse Aprilia',pts:38,pct:47,color:'#be0000'},
      {pos:7,cls:'',flag:'\ud83c\udde6\ud83c\uddfa',name:'Miller',team:'KTM Factory',pts:30,pct:37,color:'#ff6600'},
      {pos:8,cls:'',flag:'\ud83c\uddeb\ud83c\uddf7',name:'Zarco',team:'Honda LCR',pts:22,pct:27,color:'#0060cc'},
      {pos:9,cls:'',flag:'\ud83c\uddee\ud83c\uddf9',name:'Morbidelli',team:'VR46 Ducati',pts:18,pct:22,color:'#ffdd00'},
      {pos:10,cls:'',flag:'\ud83c\uddea\ud83c\uddf8',name:'A. M\u00e1rquez',team:'Gresini Racing',pts:14,pct:17,color:'#cc0000'}
    ],
    constructors:[
      {pos:1,cls:'p1',flag:'\ud83c\uddee\ud83c\uddf9',name:'Ducati',team:'Borgo Panigale',pts:210,pct:100,color:'#cc0000'},
      {pos:2,cls:'p2',flag:'\ud83c\uddee\ud83c\uddf9',name:'Aprilia',team:'Noale',pts:104,pct:50,color:'#be0000'},
      {pos:3,cls:'p3',flag:'\ud83c\udde6\ud83c\uddf9',name:'KTM',team:'Mattighofen',pts:82,pct:39,color:'#ff6600'},
      {pos:4,cls:'',flag:'\ud83c\uddef\ud83c\uddf5',name:'Honda',team:'Tokyo',pts:32,pct:15,color:'#0060cc'},
      {pos:5,cls:'',flag:'\ud83c\uddef\ud83c\uddf5',name:'Yamaha',team:'Iwata',pts:18,pct:9,color:'#0033aa'}
    ]
  },
  wec:{
    title:'Campeonato WEC 2025-26',
    season:'Hypercar \u00b7 Ap\u00f3s 3 de 8 rounds',
    tabs:['Pilotos','Fabricantes'],
    drivers:[
      {pos:1,cls:'p1',flag:'\ud83c\udde9\ud83c\uddea',name:'Estre / Lotterer',team:'Porsche Penske #6',pts:68,pct:100,color:'#c00'},
      {pos:2,cls:'p2',flag:'\ud83c\uddf3\ud83c\uddff',name:'Hartley / Hirakawa',team:'Toyota GR #8',pts:62,pct:91,color:'#e60012'},
      {pos:3,cls:'p3',flag:'\ud83c\uddec\ud83c\udde7',name:'Buemi / Nakajima',team:'Toyota GR #7',pts:55,pct:81,color:'#e60012'},
      {pos:4,cls:'',flag:'\ud83c\udde9\ud83c\uddea',name:'Campbell / Tandy',team:'Porsche Penske #5',pts:48,pct:71,color:'#c00'},
      {pos:5,cls:'',flag:'\ud83c\uddee\ud83c\uddf9',name:'Calado / Pier Guidi',team:'Ferrari AF Corse #51',pts:45,pct:66,color:'#dc0000'},
      {pos:6,cls:'',flag:'\ud83c\uddec\ud83c\udde7',name:'Ilott / Shank',team:'Cadillac Racing',pts:38,pct:56,color:'#111'},
      {pos:7,cls:'',flag:'\ud83c\uddeb\ud83c\uddf7',name:'Vergne / Di Resta',team:'Peugeot TotalEnergies #93',pts:30,pct:44,color:'#004a9b'},
      {pos:8,cls:'',flag:'\ud83c\udde9\ud83c\uddea',name:'M\u00fcller / Vanthoor',team:'BMW M Team WRT',pts:24,pct:35,color:'#1c69d4'}
    ],
    constructors:[
      {pos:1,cls:'p1',flag:'\ud83c\udde9\ud83c\uddea',name:'Porsche',team:'Porsche Penske',pts:116,pct:100,color:'#c00'},
      {pos:2,cls:'p2',flag:'\ud83c\uddef\ud83c\uddf5',name:'Toyota',team:'Toyota Gazoo Racing',pts:117,pct:100,color:'#e60012'},
      {pos:3,cls:'p3',flag:'\ud83c\uddee\ud83c\uddf9',name:'Ferrari',team:'AF Corse',pts:78,pct:67,color:'#dc0000'},
      {pos:4,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Cadillac',team:'Cadillac Racing',pts:52,pct:45,color:'#111'},
      {pos:5,cls:'',flag:'\ud83c\uddeb\ud83c\uddf7',name:'Peugeot',team:'Peugeot TotalEnergies',pts:40,pct:34,color:'#004a9b'},
      {pos:6,cls:'',flag:'\ud83c\udde9\ud83c\uddea',name:'BMW',team:'BMW M Team WRT',pts:32,pct:28,color:'#1c69d4'}
    ]
  },
  nascar:{
    title:'NASCAR Cup Series 2026',
    season:'Ap\u00f3s 8 de 36 corridas',
    tabs:['Pilotos','Fabricantes'],
    drivers:[
      {pos:1,cls:'p1',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Larson',team:'Hendrick Motorsports #5',pts:312,pct:100,color:'#ffd659'},
      {pos:2,cls:'p2',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Elliott',team:'Hendrick Motorsports #9',pts:298,pct:96,color:'#ffd659'},
      {pos:3,cls:'p3',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Byron',team:'Hendrick Motorsports #24',pts:280,pct:90,color:'#ffd659'},
      {pos:4,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Blaney',team:'Team Penske #12',pts:275,pct:88,color:'#002f6c'},
      {pos:5,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Logano',team:'Team Penske #22',pts:260,pct:83,color:'#002f6c'},
      {pos:6,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Hamlin',team:'Joe Gibbs Racing #11',pts:252,pct:81,color:'#6e2585'},
      {pos:7,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Chastain',team:'Trackhouse Racing #1',pts:240,pct:77,color:'#d22630'},
      {pos:8,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Suarez',team:'Trackhouse Racing #99',pts:235,pct:75,color:'#d22630'},
      {pos:9,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Bell',team:'Joe Gibbs Racing #20',pts:228,pct:73,color:'#6e2585'},
      {pos:10,cls:'',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Reddick',team:'23XI Racing #45',pts:220,pct:71,color:'#1e90ff'}
    ],
    constructors:[
      {pos:1,cls:'p1',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Chevrolet',team:'Camaro ZL1',pts:890,pct:100,color:'#ffd659'},
      {pos:2,cls:'p2',flag:'\ud83c\uddfa\ud83c\uddf8',name:'Ford',team:'Mustang Dark Horse',pts:770,pct:87,color:'#002f6c'},
      {pos:3,cls:'p3',flag:'\ud83c\uddef\ud83c\uddf5',name:'Toyota',team:'Camry XSE',pts:715,pct:80,color:'#e60012'}
    ]
  },
  wrc:{
    title:'Campeonato WRC 2026',
    season:'Ap\u00f3s 3 de 13 rallies',
    tabs:['Pilotos','Fabricantes'],
    drivers:[
      {pos:1,cls:'p1',flag:'\ud83c\uddeb\ud83c\uddf7',name:'Ogier',team:'Toyota Gazoo Racing',pts:67,pct:100,color:'#e60012'},
      {pos:2,cls:'p2',flag:'\ud83c\uddea\ud83c\uddf8',name:'Neuville',team:'Hyundai Shell Mobis',pts:58,pct:87,color:'#003082'},
      {pos:3,cls:'p3',flag:'\ud83c\uddec\ud83c\udde7',name:'Evans',team:'Toyota Gazoo Racing',pts:52,pct:78,color:'#e60012'},
      {pos:4,cls:'',flag:'\ud83c\uddea\ud83c\uddf8',name:'Sordo',team:'Hyundai Shell Mobis',pts:40,pct:60,color:'#003082'},
      {pos:5,cls:'',flag:'\ud83c\uddeb\ud83c\uddee',name:'Rovanper\u00e4',team:'Toyota Gazoo Racing',pts:38,pct:57,color:'#e60012'},
      {pos:6,cls:'',flag:'\ud83c\uddec\ud83c\udde7',name:'Fourmaux',team:'M-Sport Ford',pts:32,pct:48,color:'#002f6c'},
      {pos:7,cls:'',flag:'\ud83c\uddeb\ud83c\uddf7',name:'Loeb',team:'Hyundai Shell Mobis',pts:25,pct:37,color:'#003082'},
      {pos:8,cls:'',flag:'\ud83c\uddee\ud83c\uddea',name:'Breen',team:'M-Sport Ford',pts:20,pct:30,color:'#002f6c'}
    ],
    constructors:[
      {pos:1,cls:'p1',flag:'\ud83c\uddef\ud83c\uddf5',name:'Toyota GR',team:'Toyota Gazoo Racing',pts:157,pct:100,color:'#e60012'},
      {pos:2,cls:'p2',flag:'\ud83c\uddf0\ud83c\uddf7',name:'Hyundai',team:'Hyundai Shell Mobis',pts:123,pct:78,color:'#003082'},
      {pos:3,cls:'p3',flag:'\ud83c\uddec\ud83c\udde7',name:'M-Sport Ford',team:'M-Sport',pts:52,pct:33,color:'#002f6c'}
    ]
  }
};

// Keep backwards compatibility
const DRIVERS=CHAMP_DATA.f1.drivers;
const CONSTRUCTORS=CHAMP_DATA.f1.constructors;
// Dynamic pilots from database
function _getRealPilots() {
  if (typeof Driver === 'undefined') return [];
  const pilots = Driver.getUsersByType('piloto');
  return pilots.map(p => ({
    id: p.id,
    name: p.pilot_name || p.name,
    cats: p.category || 'Automobilismo',
    plan: Driver.getPlanName(p.plan),
    wins: p.conquests?.wins || 0,
    podios: p.conquests?.podiums || 0,
    img: p.avatar_url || p.cover_url || 'img/pilot-placeholder.png',
    cover: p.cover_url || '',
    avatar: p.avatar || '🏁',
  }));
}
const PILOTS = _getRealPilots();

/* ══ VIEW ROUTER ══ */
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const el=document.getElementById('view-'+id);
  if(el){
    el.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
    // Force reveal all sections in this view that are stuck at opacity:0
    setTimeout(() => {
      el.querySelectorAll('.reveal, .reveal-section').forEach(s => {
        s.classList.add('in');
        s.classList.add('revealed');
        s.classList.add('active');
      });
    }, 50);
  }
  // init views
  if(id==='pilots-list')renderPilotsList();
  if(id==='teams-list')renderTeamsList();
  if(id==='portal')renderPilotsHighlight();
  if(id==='calendar')renderCalendar();
  if(id==='standings')renderFullStandings('drv');
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
  window.location.href = 'materia.html?id=' + id;
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
    <div class="sr-meta"><span class="badge ${a.badge}" style="font-size:8px">${a.cat.toUpperCase()}</span><span>${a.author}</span>${a.pago?'<span class="tag-pago" style="font-size:8px;padding:1px 6px"><i class="fi fi-rr-star"></i> Patrocinado</span>':'<span class="tag-int" style="font-size:8px;padding:1px 6px"><i class="fi fi-rr-pencil"></i> Driver</span>'}</div></div>
  </div>`).join('');
}
document.getElementById('searchField').addEventListener('input',e=>renderSearch(e.target.value));

/* ══ STANDINGS ══ */
let activeCat='f1';
function renderStand(data){
  document.getElementById('standTable').innerHTML='<tbody>'+data.map(r=>`<tr onclick="toast('${r.name} \u2014 ${r.pts} pts \u00b7 ${r.team}','info')"><td class="s-pos ${r.cls}">${r.pos}</td><td class="s-flag">${r.flag}</td><td><div class="s-name">${r.name}</div><div class="s-team">${r.team}</div></td><td class="s-bar-c"><div class="s-bar-bg"><div class="s-bar" style="width:${r.pct}%;background:${r.color}"></div></div></td><td class="s-pts">${r.pts}</td></tr>`).join('')+'</tbody>';
}
function switchStand(el,tab){
  document.querySelectorAll('.s-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  const c=CHAMP_DATA[activeCat];
  if(!c)return;
  renderStand(tab==='drv'?c.drivers:c.constructors);
}
function updateStandings(cat){
  const c=CHAMP_DATA[cat];
  if(!c)return;
  activeCat=cat;
  // Update title
  const titleEl=document.querySelector('.two-col .sec-title');
  if(titleEl) titleEl.textContent=c.title;
  // Update tab labels
  const tabs=document.querySelectorAll('.s-tab');
  if(tabs[0]) tabs[0].textContent=c.tabs[0];
  if(tabs[1]) tabs[1].textContent=c.tabs[1];
  // Reset to first tab active
  tabs.forEach(t=>t.classList.remove('active'));
  if(tabs[0]) tabs[0].classList.add('active');
  // Render drivers by default
  renderStand(c.drivers);
  // Update next race
  renderNextRace(cat);
}
renderStand(DRIVERS);

/* ══ NEXT RACE DATA ══ */
const NEXT_RACES={
  f1:{
    flag:'\ud83c\uddfa\ud83c\uddf8',gp:'GP de Miami 2026',circuit:'MIAMI INTERNATIONAL AUTODROME',
    round:'RONDA 4',extra:'SPRINT WEEKEND',raceDate:'2026-05-03T21:00:00Z',
    source:'formula1.com \u00b7 GPFans \u00b7 ESPN',
    sessions:[
      {name:'FP1',time:'Sex \u00b7 13:30'},
      {name:'Classif. Sprint',time:'Sex \u00b7 17:30'},
      {name:'Sprint',time:'S\u00e1b \u00b7 13:00'},
      {name:'Classifica\u00e7\u00e3o',time:'S\u00e1b \u00b7 17:00'},
      {name:'Corrida',time:'Dom 03/05 \u00b7 17:00'}
    ]
  },
  motogp:{
    flag:'🇪🇸',gp:'GP da Espanha 2026',circuit:'CIRCUITO DE JEREZ',
    round:'RONDA 4',extra:'',raceDate:'2026-04-26T13:00:00Z',
    source:'motogp.com · MotoSport',
    sessions:[
      {name:'FP1',time:'Sex 24/04 · 05:45'},
      {name:'FP2',time:'Sex 24/04 · 10:00'},
      {name:'Classificação',time:'Sáb 25/04 · 05:50'},
      {name:'Sprint',time:'Sáb 25/04 · 10:00'},
      {name:'Corrida',time:'Dom 26/04 · 09:00'}
    ]
  },
  wec:{
    flag:'🇮🇹',gp:'6h de Ímola 2026',circuit:'AUTODROMO ENZO E DINO FERRARI',
    round:'RONDA 2 DE 8',extra:'',raceDate:'2026-04-19T13:00:00Z',
    source:'fiawec.com · FIA',
    sessions:[
      {name:'TL1',time:'Sex 17/04 · 07:30'},
      {name:'TL2',time:'Sex 17/04 · 12:00'},
      {name:'Classificação',time:'Sáb 18/04 · 07:10'},
      {name:'Corrida (6h)',time:'Dom 19/04 · 08:00'}
    ]
  },
  nascar:{
    flag:'🇺🇸',gp:'Talladega 2026',circuit:'TALLADEGA SUPERSPEEDWAY',
    round:'RONDA 10 DE 36',extra:'',raceDate:'2026-04-26T19:00:00Z',
    source:'nascar.com · Jayski',
    sessions:[
      {name:'Prática',time:'Sáb 25/04 · 12:00'},
      {name:'Classificação',time:'Sáb 25/04 · 14:00'},
      {name:'Corrida',time:'Dom 26/04 · 15:00'}
    ]
  },
  wrc:{
    flag:'🇵🇹',gp:'Rally de Portugal 2026',circuit:'MATOSINHOS / FAFE / AMARANTE',
    round:'RONDA 4 DE 13',extra:'',raceDate:'2026-05-17T11:18:00Z',
    source:'wrc.com · FIA',
    sessions:[
      {name:'Shakedown',time:'Qui 14/05 · 08:00'},
      {name:'SS1-SS8',time:'Sex 15/05 · 07:00'},
      {name:'SS9-SS16',time:'Sáb 16/05 · 07:30'},
      {name:'Power Stage',time:'Dom 17/05 · 11:18'}
    ]
  }
};

let activeRaceTimer=null;

function renderNextRace(cat){
  const r=NEXT_RACES[cat]||NEXT_RACES.f1;
  const box=document.getElementById('nextRaceBox');
  if(!box)return;

  const extraBadge=r.extra?` \u00b7 ${r.extra}`:'';
  const sessHtml=r.sessions.map(s=>`<li class="sess-item"><span class="sess-name">${s.name}</span><span class="sess-time">${s.time}</span></li>`).join('');

  box.innerHTML=`<div class="race-box">
    <div class="race-header">
      <div style="font-size:28px">${r.flag}</div>
      <div class="race-gp">${r.gp}</div>
      <div class="race-circuit">${r.circuit} \u00b7 ${r.round}${extraBadge}</div>
    </div>
    <div class="cd-grid">
      <div class="cd-box"><span class="cd-n" id="cd-d">00</span><span class="cd-l">Dias</span></div>
      <div class="cd-box"><span class="cd-n" id="cd-h">00</span><span class="cd-l">Horas</span></div>
      <div class="cd-box"><span class="cd-n" id="cd-m">00</span><span class="cd-l">Min</span></div>
      <div class="cd-box"><span class="cd-n" id="cd-s">00</span><span class="cd-l">Seg</span></div>
    </div>
    <ul class="sess-list">${sessHtml}</ul>
    <div style="padding:8px 20px 14px;font-family:var(--fm);font-size:9px;color:var(--muted)">Fonte: ${r.source} \u00b7 hor\u00e1rios em BRT</div>
  </div>`;

  // Start countdown
  if(activeRaceTimer) clearInterval(activeRaceTimer);
  const target=new Date(r.raceDate);
  function tick(){
    const d=target-new Date();
    if(d<=0){
      const cg=document.querySelector('.cd-grid');
      if(cg) cg.innerHTML='<div style="grid-column:span 4;text-align:center;padding:16px;font-family:var(--fm);font-size:11px;color:var(--acc)"><i class="fi fi-rr-flag"></i> CORRIDA EM ANDAMENTO</div>';
      return;
    }
    const dd=document.getElementById('cd-d'),dh=document.getElementById('cd-h'),dm=document.getElementById('cd-m'),ds=document.getElementById('cd-s');
    if(dd) dd.textContent=pad(Math.floor(d/86400000));
    if(dh) dh.textContent=pad(Math.floor((d%86400000)/3600000));
    if(dm) dm.textContent=pad(Math.floor((d%3600000)/60000));
    if(ds) ds.textContent=pad(Math.floor((d%60000)/1000));
  }
  tick();
  activeRaceTimer=setInterval(tick,1000);
}
function pad(n){return String(n).padStart(2,'0')}

// Initial render
renderNextRace('f1');

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

/* ── HERO DATA POR CATEGORIA ── */
const HERO_DATA={
  f1:{
    img:'https://upload.wikimedia.org/wikipedia/commons/3/3f/FIA_F1_Austria_2023_Nr._44_%282%29.jpg',
    typeCls:'int', typeIcon:'fi fi-rr-pencil', typeLabel:'CONTEÚDO DRIVER',
    badge:'F1 · TEMPORADA 2026', badgeCls:'b-f1',
    title:'Mercedes Surpreende em 2026 e Retoma o Controle do Mundial de F1',
    excerpt:'A flecha de prata domina o campeonato de construtores após 3 GPs — Austrália, China e Japão — provando que decodificou perfeitamente o novo regulamento híbrido.',
    meta:'Redação Driver · 10 Abr 2026 · Fonte: formula1.com · GPFans · ESPN',
    articleId:0,
    sides:[
      {img:'https://upload.wikimedia.org/wikipedia/commons/9/9f/FIA_F1_Austria_2023_Nr._55_%281%29.jpg',typeCls:'ext',typeLabel:'SKY SPORTS F1 ↗',badge:'F1 · FERRARI',badgeCls:'b-f1',title:'Ferrari Prepara Pacote Agressivo de Atualizações para o GP de Miami',link:'https://www.skysports.com/f1'},
      {img:'https://upload.wikimedia.org/wikipedia/commons/7/79/FIA_F1_Austria_2023_Nr._1_%281%29.jpg',typeCls:'ext',typeLabel:'ESPN ↗',badge:'F1 · RED BULL',badgeCls:'b-f1',title:'Verstappen Exige Respostas da Red Bull Após Desempenho Irregular',link:'https://www.espn.com/f1'}
    ]
  },
  motogp:{
    img:'https://upload.wikimedia.org/wikipedia/commons/d/dc/MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg',
    typeCls:'int', typeIcon:'fi fi-rr-pencil', typeLabel:'CONTEÚDO DRIVER',
    badge:'MOTOGP · TEMPORADA 2026', badgeCls:'b-motogp',
    title:'Bagnaia Domina Início de Temporada com 81 Pontos e Duas Vitórias',
    excerpt:'Francesco Bagnaia (Ducati Lenovo) lidera o campeonato após 3 GPs — Tailândia, Argentina e Américas — ameaçado de perto por Marc Márquez na Gresini.',
    meta:'Redação Driver · 13 Abr 2026 · Fonte: motogp.com · MotoSport',
    articleId:0,
    sides:[
      {img:'https://upload.wikimedia.org/wikipedia/commons/a/a1/MotoGP_2025_Malaysian_Grand_Prix_-_Honda_HRC_Castrol_-_Luca_Marini.jpg',typeCls:'ext',typeLabel:'MOTOGP.COM ↗',badge:'MOTOGP · HRC',badgeCls:'b-motogp',title:'Honda Planeja Amplo Pacote de Atualizações Após Início Difícil',link:'https://www.motogp.com'},
      {img:'https://upload.wikimedia.org/wikipedia/commons/b/b2/MotoGP_2025_Malaysian_Grand_Prix_-_Monster_Energy_Yamaha_-_Fabio_Quartararo.jpg',typeCls:'ext',typeLabel:'MOTORSPORT ↗',badge:'MOTOGP · YAMAHA',badgeCls:'b-motogp',title:'Quartararo Cobra Yamaha por Melhorias Radicais na M1',link:'https://www.motorsport.com/motogp'}
    ]
  },
  wec:{
    img:'https://upload.wikimedia.org/wikipedia/commons/a/a5/2024_6_Hours_of_Spa-Francorchamps_Porsche_Penske_Motorsport_Porsche_963_No.5_%28DSC02380%29.jpg',
    typeCls:'int', typeIcon:'fi fi-rr-pencil', typeLabel:'CONTEÚDO DRIVER',
    badge:'WEC · SUPERTEMPORADA', badgeCls:'b-wec',
    title:'Toyota vs Porsche: A Batalha Mais Acirrada da Era Hypercar',
    excerpt:'Com Toyota e Porsche separados por apenas 1 ponto na classificação de fabricantes, a temporada 2025-26 do WEC é a mais emocionante da história.',
    meta:'Redação Driver · 13 Abr 2026 · Fonte: fiawec.com · Sportscar365',
    articleId:0,
    sides:[
      {img:'https://upload.wikimedia.org/wikipedia/commons/9/98/2024_24_Hours_of_Le_Mans_%2854093434577%29.jpg',typeCls:'ext',typeLabel:'SPORTSCAR365 ↗',badge:'WEC · LE MANS',badgeCls:'b-wec',title:'24 Horas de Le Mans 2026: Grid Recorde com 62 Carros Confirmados',link:'https://sportscar365.com'},
      {img:'https://upload.wikimedia.org/wikipedia/commons/9/91/2024_24_Hours_of_Le_Mans_%2854093434907%29.jpg',typeCls:'ext',typeLabel:'FIA WEC ↗',badge:'WEC · HYPERCAR',badgeCls:'b-wec',title:'Cadillac Surpreende com Ritmo em Ímola — Ameaça Real?',link:'https://www.fiawec.com'}
    ]
  },
  nascar:{
    img:'https://upload.wikimedia.org/wikipedia/commons/0/07/Kyle_Larson_5_Las_Vegas_2025.jpg',
    typeCls:'int', typeIcon:'fi fi-rr-pencil', typeLabel:'CONTEÚDO DRIVER',
    badge:'NASCAR · CUP SERIES 2026', badgeCls:'b-nascar',
    title:'Kyle Larson Abre 2026 com Daytona 500: Hendrick Motorsports Avassalador',
    excerpt:'Hendrick Motorsports coloca 3 pilotos no top 3 e domina o início da temporada 2026 da NASCAR Cup Series com Larson, Elliott e Byron.',
    meta:'Redação Driver · 13 Abr 2026 · Fonte: nascar.com · Jayski',
    articleId:0,
    sides:[
      {img:'https://upload.wikimedia.org/wikipedia/commons/0/07/Kyle_Larson_5_Las_Vegas_2025.jpg',typeCls:'ext',typeLabel:'NASCAR.COM ↗',badge:'NASCAR · HENDRICK',badgeCls:'b-nascar',title:'Elliott e Byron Completam Domínio da Hendrick no Início de 2026',link:'https://www.nascar.com'},
      {img:'https://upload.wikimedia.org/wikipedia/commons/0/07/Kyle_Larson_5_Las_Vegas_2025.jpg',typeCls:'ext',typeLabel:'JAYSKI ↗',badge:'NASCAR · PENSKE',badgeCls:'b-nascar',title:'Blaney Cobra Team Penske por Estratégias Mais Agressivas',link:'https://www.jayski.com'}
    ]
  },
  wrc:{
    img:'https://upload.wikimedia.org/wikipedia/commons/a/a5/2024_6_Hours_of_Spa-Francorchamps_Porsche_Penske_Motorsport_Porsche_963_No.5_%28DSC02380%29.jpg',
    typeCls:'int', typeIcon:'fi fi-rr-pencil', typeLabel:'CONTEÚDO DRIVER',
    badge:'WRC · TEMPORADA 2026', badgeCls:'b-wrc',
    title:'Ogier Lidera WRC 2026 com Toyota Invicta em Monte-Carlo',
    excerpt:'Sébastien Ogier conquista a primeira posição no campeonato após Rally de Monte-Carlo, Rally da Suécia e Safari Rally.',
    meta:'Redação Driver · 13 Abr 2026 · Fonte: wrc.com · FIA',
    articleId:0,
    sides:[
      {img:'https://upload.wikimedia.org/wikipedia/commons/a/a5/2024_6_Hours_of_Spa-Francorchamps_Porsche_Penske_Motorsport_Porsche_963_No.5_%28DSC02380%29.jpg',typeCls:'ext',typeLabel:'WRC.COM ↗',badge:'WRC · HYUNDAI',badgeCls:'b-wrc',title:'Neuville Pressiona Ogier na Luta Pelo Título',link:'https://www.wrc.com'},
      {img:'https://upload.wikimedia.org/wikipedia/commons/a/a5/2024_6_Hours_of_Spa-Francorchamps_Porsche_Penske_Motorsport_Porsche_963_No.5_%28DSC02380%29.jpg',typeCls:'ext',typeLabel:'FIA ↗',badge:'WRC · M-SPORT',badgeCls:'b-wrc',title:'Fourmaux Surpreende com Desempenho no Safari Rally',link:'https://www.fia.com/wrc'}
    ]
  }
};



function filterCat(cat){
  window.newsLimit = 9;
  currentCat=cat;applyFilter();
  document.getElementById('newsSectionTitle').textContent=cat==='all'?'Últimas Notícias':'Notícias · '+cat.toUpperCase();
  // Update standings to match category
  const champCat=CHAMP_DATA[cat]?cat:'f1';
  updateStandings(champCat);
  const champSec = document.getElementById('champSection');
  if(champSec) champSec.style.display = (cat === 'all' || cat === 'sim') ? 'none' : '';
  
  // Re-render hero dynamically based on category
  renderHeroGrid(cat);
}
function filterType(el,type){
  document.querySelectorAll('.ftag').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  currentType=type;applyFilter();
}
window.newsLimit = 9;

function applyFilter(){
  let delay=0;
  let count=0;
  let totalMatch=0;
  document.querySelectorAll('#cardGrid .news-card').forEach(c=>{
    const cat=c.dataset.cat;
    const catOk=currentCat==='all'||cat===currentCat;
    if(catOk) totalMatch++;
    if(catOk && count < window.newsLimit){
      c.style.display='';
      c.classList.remove('filtered-out');
      c.classList.add('filtered-in');
      c.style.animationDelay=(delay*0.04)+'s';
      delay++;
      count++;
    }else{
      c.style.display='none';
      c.classList.add('filtered-out');
      c.classList.remove('filtered-in');
    }
  });

  const loadMoreBtn = document.getElementById('newsLoadMore');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = totalMatch > window.newsLimit ? '' : 'none';
  }
}
function catAct(el){document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));el.classList.add('active')}

/* ── CONTAGEM REAL ── */
function updateCatCounts(){
  const counts={all:0,f1:0,motogp:0,wec:0,nascar:0,sim:0,wrc:0,'stock-car':0,indycar:0,geral:0};
  // Count from ARTICLES array
  ARTICLES.forEach(a=>{
    const cat=a.cat;
    counts.all++;
    if(counts[cat]!==undefined) counts[cat]++;
  });
  document.querySelectorAll('.cat-pill').forEach(p=>{
    const cnt=p.querySelector('.cat-cnt');
    if(!cnt)return;
    const pCat=p.dataset.cat;
    if(pCat&&counts[pCat]!==undefined){
      cnt.textContent=counts[pCat]+' notícia'+(counts[pCat]!==1?'s':'');
    } else if(pCat==='all'){
      cnt.textContent=counts.all+' notícias';
    }
  });
}

/* ══ PILOTS ══ */
function renderPilotsHighlight(){
  const g=document.getElementById('pilotsHighlight');if(!g)return;
  const pilots = _getRealPilots();
  if (pilots.length === 0) {
    g.innerHTML='<div style="padding:24px;text-align:center;color:var(--muted);font-size:13px;grid-column:1/-1">Nenhum piloto cadastrado ainda.</div>';
    return;
  }
  g.innerHTML=pilots.map(p=>{
    const articleCount = typeof Driver !== 'undefined' ? Driver.getPublishedByAuthor(p.id).length : 0;
    return `<div class="pcard" onclick="window.location.href='piloto.html?id=${p.id}'">
    <div class="pcard-cover"><img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'"></div>
    <div class="pcard-body">
      <div style="position:absolute;top:10px;right:10px"><span class="badge b-piloto" style="font-size:8px">✓ Verificado</span></div>
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-cats">${p.cats}</div>
      <div class="pcard-stats">
        <div class="pstat"><span class="pstat-n">${p.wins}</span><span class="pstat-l">Vitórias</span></div>
        <div class="pstat"><span class="pstat-n">${p.podios}</span><span class="pstat-l">Pódios</span></div>
        <div class="pstat"><span class="pstat-n">${articleCount}</span><span class="pstat-l">Matérias</span></div>
      </div>
    </div>
  </div>`;
  }).join('');
}
function renderPilotsList(){
  const g=document.getElementById('pilotsListGrid');if(!g)return;
  const pilots = _getRealPilots();
  const countEl = document.getElementById('pilotsCount');
  if (countEl) countEl.textContent = pilots.length + ' pilotos ativos';
  g.innerHTML=pilots.map(p=>{
    const articleCount = typeof Driver !== 'undefined' ? Driver.getPublishedByAuthor(p.id).length : 0;
    return `<div class="pcard" onclick="window.location.href='piloto.html?id=${p.id}'">
    <div class="pcard-cover"><img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'"></div>
    <div class="pcard-body">
      <div style="position:absolute;top:10px;right:10px"><span class="badge b-piloto" style="font-size:8px">✓ Verificado</span></div>
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-cats">${p.cats}</div>
      <div class="pcard-stats">
        <div class="pstat"><span class="pstat-n">${p.wins}</span><span class="pstat-l">Vitórias</span></div>
        <div class="pstat"><span class="pstat-n">${p.podios}</span><span class="pstat-l">Pódios</span></div>
        <div class="pstat"><span class="pstat-n">${articleCount}</span><span class="pstat-l">Matérias</span></div>
      </div>
      <button class="btn btn-acc btn-full btn-sm" style="margin-top:12px" onclick="event.stopPropagation();window.location.href='piloto.html?id=${p.id}'">Ver perfil →</button>
    </div>
  </div>`;
  }).join('');
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
async function doLogin(){
  const e=document.getElementById('loginEmail').value.trim();
  const p=document.getElementById('loginPass').value;
  if(!e||!p){toast('Preencha e-mail e senha','err');return}
  toast('Verificando credenciais...','info');
  
  if (typeof Driver !== 'undefined') {
    const user = await Driver.login(e, p);
    if (!user) {
      toast('E-mail ou senha incorretos','err');
      return;
    }
    toast('Login realizado!','ok');
    
    // Redirect logic
    setTimeout(() => {
      const t = user.type === 'equipe' ? 'dashboard-equipe.html' : user.type === 'categoria' ? 'dashboard-categoria.html' : 'dashboard-piloto.html';
      window.location.href = t;
    }, 800);
  } else {
    toast('Erro no sistema (Driver não encontrado)','err');
  }
}
async function loginAs(type){
  toast('Entrando como '+type+'...','info');
  // Encontrar um usuário com esse tipo e logar mockado
  if (typeof Driver !== 'undefined') {
    const users = Driver.getUsers().filter(u => u.type === (type==='admin'?'admin':type));
    if (users.length > 0) {
      Driver.forceLoginById(users[0].id);
    } else {
      // Create a dummy session by creating a dummy user
      const u = await Driver.addUser({
        name: type === 'equipe' ? 'Equipe Demo' : type === 'categoria' ? 'Liga Demo' : 'Felipe Massa Demo',
        email: 'demo@' + type + '.com',
        type: type === 'admin' ? 'admin' : type,
        status: 'active',
        plan: type === 'equipe' ? 'equipe' : type === 'categoria' ? 'categoria' : 'pro'
      });
      if(u) Driver.forceLoginById(u.id);
    }
  }
  setTimeout(() => {
    const t = type === 'equipe' ? 'dashboard-equipe.html' : type === 'categoria' ? 'dashboard-categoria.html' : type === 'admin' ? 'admin.html' : 'dashboard-piloto.html';
    window.location.href = t;
  }, 200);
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
function getShareUrl() {
  if (window.currentArt) {
    const a = window.currentArt;
    return location.origin + '/api/share?id=' + encodeURIComponent(a.id) +
           '&t=' + encodeURIComponent(a.title) +
           '&d=' + encodeURIComponent(a.abstract || a.kicker || 'Acompanhe as últimas notícias do automobilismo.') +
           '&i=' + encodeURIComponent(a.img);
  }
  return location.href;
}

function copyLink() {
  const url = getShareUrl();
  navigator.clipboard?.writeText(url)
    .then(() => toast('✓ Link copiado!', 'ok'))
    .catch(() => { /* fallback */ prompt('Copie este link:', url); toast('✓ Link pronto para copiar', 'info'); });
}

function shareWhatsApp() {
  const url = getShareUrl();
  window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Confira no PitLane News: ' + url), '_blank');
}
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

/* ══ DYNAMIC HERO PIPELINE ══ */
async function loadDynamicHeroAll() {
  if(!window.Driver || !window.Driver.Live) return;
  try {
    const f1News = await Driver.Live.getNewsByCategory('f1');
    const motogpNews = await Driver.Live.getNewsByCategory('motogp');
    const stockNews = await Driver.Live.getNewsByCategory('stock-car');

    if(f1News.length && motogpNews.length && stockNews.length) {
      const m = f1News[0];
      const s1 = motogpNews[0];
      const s2 = stockNews[0];

      HERO_DATA['all'] = {
        img: m.thumbnail,
        typeCls: 'ext', typeIcon: 'fi fi-rr-link', typeLabel: 'GRANDE PRÊMIO ↗',
        badge: 'F1 · ÚLTIMAS', badgeCls: 'b-f1',
        title: m.title,
        excerpt: m.title, 
        meta: 'Redação Externa · Fonte: grandepremio.com.br',
        isExt: true,
        extLink: m.link,
        sides: [
          {img: s1.thumbnail, typeCls: 'ext', typeLabel: 'GRANDE PRÊMIO ↗', badge: 'MOTOGP', badgeCls: 'b-motogp', title: s1.title, link: s1.link},
          {img: s2.thumbnail, typeCls: 'ext', typeLabel: 'GRANDE PRÊMIO ↗', badge: 'STOCK CAR', badgeCls: 'b-wec', title: s2.title, link: s2.link}
        ]
      };
      if (currentCat === 'all') { updateHero('all'); }
    }
  } catch (e) {
    console.error('Failed to load dynamic hero', e);
  }
}

/* ══ DYNAMIC LIVE NEWS PIPELINE ══ */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.Driver && typeof window.Driver.bootSupabase === 'function') {
    try {
      await window.Driver.bootSupabase();
    } catch(e) { console.error('Supabase boot fail', e); }
  }
  await loadLiveNews();
  
  // Auto-refresh every 5 minutes
  setInterval(async () => {
    console.log('[Timer] Refreshing news feeds...');
    await loadLiveNews();
  }, 300000);
});

let newsPage = 0;
const NEWS_PER_PAGE = 12;
let allFeedArticles = [];

async function loadLiveNews() {
  const grid = document.getElementById('cardGrid');
  const sourceCount = document.getElementById('newsSourceCount');
  
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('API ' + res.status);
    const json = await res.json();
    
    if (!json.success || !json.data?.br?.length) {
      throw new Error('Empty feed');
    }
    
    allFeedArticles = json.data.br;
    newsPage = 0;
    
    // Update source counter
    const sources = json.sources || [];
    const total = json.total || allFeedArticles.length;
    if (sourceCount) {
      sourceCount.textContent = total + ' notícias · ' + sources.length + ' fontes: ' + sources.join(' · ');
    }
    
    // Map to ARTICLES for search compatibility
    ARTICLES = allFeedArticles.map((n, i) => {
      const slugCat = (n.category || 'F1').toLowerCase().replace(/\s+/g, '-');
      return {
        id: 'rss' + i,
        cat: slugCat,
        badge: 'b-' + slugCat,
        kicker: 'NOTÍCIAS',
        title: n.title,
        link: n.url,
        author: n.source || 'Portal',
        date: formatNewsDate(n.published_at),
        img: n.image_url,
        abstract: n.abstract || '',
        isReal: true,
        rawDate: new Date(n.published_at).getTime() || 0
      };
    });
    
    // Inject internal assinantes news if available
    try {
      if (typeof Driver !== 'undefined' && typeof Driver.getArticles === 'function') {
        const publicArts = Driver.getArticles().filter(a => a.status === 'published');
        const internalNews = publicArts.map(a => {
          const slugCat = (a.category || 'geral').toLowerCase().replace(/\s+/g, '-');
          const dTime = new Date(a.publishedAt || a.submittedAt || Date.now()).getTime();
          return {
            id: a.id,
            cat: slugCat,
            badge: 'b-' + slugCat,
            kicker: 'PILOTO VERIFICADO',
            title: a.title,
            link: 'materia.html?id=' + a.id,
            author: a.authorName || 'Portal',
            date: formatNewsDate(a.publishedAt || a.submittedAt || new Date()),
            img: a.img || 'https://images.unsplash.com/photo-1541344983572-c511a5fe03fd?auto=format&fit=crop&w=1200&q=80',
            abstract: (a.body || '').replace(/<[^>]*>?/gm, '').substring(0,180) + '...',
            isReal: false,
            rawDate: dTime
          };
        });
        ARTICLES = [...internalNews, ...ARTICLES];
        // Sort everything purely chronologically (Internal stays on top if fresh, falls if third party is fresher)
        ARTICLES.sort((a,b) => b.rawDate - a.rawDate);
      }
    } catch(err) { console.error('Erro injetando noticias de pilotos', err); }
    
    // Render
    renderHeroGrid();
    renderNewsGrid();
    applyFilter();
    renderTicker();
    updateCatCounts();
    
  } catch(e) {
    console.warn('[News] Pipeline error, using internal articles only:', e);
    // FALLBACK: Usar apenas matérias reais dos pilotos cadastrados (Supabase)
    ARTICLES = [];
    try {
      if (typeof Driver !== 'undefined' && typeof Driver.getArticles === 'function') {
        const publicArts = Driver.getArticles().filter(a => a.status === 'published');
        ARTICLES = publicArts.map(a => {
          const slugCat = (a.category || 'geral').toLowerCase().replace(/\s+/g, '-');
          return {
            id: a.id, cat: slugCat, badge: 'b-' + slugCat,
            kicker: 'PILOTO VERIFICADO', title: a.title,
            link: 'materia.html?id=' + a.id, author: a.authorName || 'Portal',
            date: formatNewsDate(a.publishedAt || a.submittedAt || new Date()),
            img: a.img || 'https://images.unsplash.com/photo-1541344983572-c511a5fe03fd?auto=format&fit=crop&w=1200&q=80',
            abstract: (a.body || '').replace(/<[^>]*>?/gm, '').substring(0, 180) + '...',
            isReal: false, rawDate: new Date(a.publishedAt || a.submittedAt || Date.now()).getTime()
          };
        });
      }
    } catch(err) { console.error('Fallback article load failed', err); }
    
    if (grid) {
      const loading = document.getElementById('newsLoading');
      if (loading) loading.innerHTML = '<span style="color:#666">Feed temporariamente indisponível. Exibindo matérias internas. <button class="btn btn-out btn-sm" onclick="loadLiveNews()" style="margin-left:8px">Tentar novamente</button></span>';
    }
    
    // Renderizar mesmo com fallback
    if (ARTICLES.length >= 3) {
      renderHeroGrid();
    }
    renderNewsGrid();
    applyFilter();
    renderTicker();
    updateCatCounts();
  }
}

function formatNewsDate(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 3600000) return 'há ' + Math.max(1, Math.floor(diff / 60000)) + ' min';
    if (diff < 86400000) return 'há ' + Math.floor(diff / 3600000) + 'h';
    
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(d);
  } catch(e) {
    return dateStr;
  }
}

function getCatClass(category) {
  const cat = (category || '').toLowerCase().replace(/\s+/g, '-');
  const map = {
    'f1': 'cat-f1', 'motogp': 'cat-motogp', 'stock-car': 'cat-stock-car',
    'wec': 'cat-wec', 'endurance': 'cat-wec', 'nascar': 'cat-nascar',
    'indycar': 'cat-indycar', 'wrc': 'cat-wrc', 'geral': 'cat-geral'
  };
  return map[cat] || 'cat-geral';
}

let HERO_IDS = [];

function renderHeroGrid(catFilter = 'all') {
  const grid = document.getElementById('heroGrid');
  const wrap = document.querySelector('.hero-wrap');
  if (!grid || ARTICLES.length < 3) return;

  HERO_IDS = [];
  let a0, a1, a2;

  if (catFilter === 'all') {
    if (wrap) wrap.style.display = '';
    
    // Prioritize slots
    const f1A = ARTICLES.find(a => a.cat === 'f1');
    const motoA = ARTICLES.find(a => a.cat === 'motogp' || a.cat === 'moto-gp');
    const pilotoA = ARTICLES.find(a => a.isReal === false); // "Nossos pilotos"
    
    a0 = pilotoA;
    a1 = f1A;
    a2 = motoA;

    // Preencher slots nulos caso as opções preferenciais não existam
    for(let i=0; i<ARTICLES.length; i++) {
        if (!a0 && ARTICLES[i] !== a1 && ARTICLES[i] !== a2) { a0 = ARTICLES[i]; continue; }
        if (!a1 && ARTICLES[i] !== a0 && ARTICLES[i] !== a2) { a1 = ARTICLES[i]; continue; }
        if (!a2 && ARTICLES[i] !== a0 && ARTICLES[i] !== a1) { a2 = ARTICLES[i]; continue; }
    }
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
  
  HERO_IDS = [a0.id, a1.id, a2.id];

  const getClk = (a) => a.isReal === false ? `window.location.href='${a.link}'` : `window.open('${a.link}','_blank')`;

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
    <div class="hero-side">
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
}

function renderNewsGrid() {
  const grid = document.getElementById('cardGrid');
  if (!grid || ARTICLES.length < 4) return;

  const display = ARTICLES.filter(a => !HERO_IDS.includes(a.id));
  
  grid.innerHTML = display.map(a => {
    const catCls = getCatClass(a.cat);
    const safeUrl = (a.link || '').replace(/'/g, "\\'");
    
    return `
      <a href="${safeUrl}" target="_blank" rel="noopener nofollow" class="news-card" data-cat="${a.cat}" style="text-decoration:none; color:inherit;">
        <div class="news-card-thumb">
          <img src="/api/img-proxy?url=${encodeURIComponent(a.img)}" alt="" loading="lazy">
          <span class="news-card-cat ${catCls}">${a.cat.toUpperCase()}</span>
        </div>
        <div class="news-card-body">
          <div class="news-card-source">
            <span class="source-dot"></span>
            <span class="source-name">${a.author.toUpperCase()}</span>
            <span class="source-date">· ${a.date}</span>
          </div>
          <div class="news-card-title">${a.title}</div>
          <div class="news-card-footer">
            <span class="news-card-cta">
              Ler no portal proprietário: ${a.author}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:4px; margin-bottom:2px"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

function renderTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track || !ARTICLES.length) return;
  
  const top = ARTICLES.slice(0, 8);
  const items = top.map(a => {
    const safeUrl = (a.link || '').replace(/'/g, "\\'");
    return `<span class="t-item" onclick="window.open('${safeUrl}','_blank')">${a.author.toUpperCase()} · ${a.title}</span>`;
  }).join('');
  
  track.innerHTML = items + items; // Duplicate for infinite scroll
}

function loadMoreNews() {
  window.newsLimit += 9;
  applyFilter();
}

/* ══════════════════════════════════════════
   CALENDAR
══════════════════════════════════════════ */
const CAL_DATA={
  f1:{
    title:'Calendário F1 2026', badge:'TEMPORADA 2026', sub:'Todas as corridas da temporada · Horários em BRT (Brasília)',
    source:'formula1.com · FIA',
    races:[
      {r:1,flag:'\ud83c\udde6\ud83c\uddfa',gp:'GP da Austrália',circuit:'Albert Park, Melbourne',date:'2026-03-14',end:'2026-03-16',sprint:false,winner:'Antonelli'},
      {r:2,flag:'\ud83c\udde8\ud83c\uddf3',gp:'GP da China',circuit:'Shanghai International Circuit',date:'2026-03-28',end:'2026-03-30',sprint:true,winner:'Antonelli'},
      {r:3,flag:'\ud83c\uddef\ud83c\uddf5',gp:'GP do Japão',circuit:'Suzuka International Racing Course',date:'2026-04-04',end:'2026-04-06',sprint:false,winner:'Russell'},
      {r:4,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'GP de Miami',circuit:'Miami International Autodrome',date:'2026-05-01',end:'2026-05-03',sprint:true,winner:null},
      {r:5,flag:'\ud83c\uddea\ud83c\uddf8',gp:'GP da Espanha',circuit:'Circuit de Barcelona-Catalunya',date:'2026-05-17',end:'2026-05-18',sprint:false,winner:null},
      {r:6,flag:'\ud83c\uddf2\ud83c\udde8',gp:'GP de Mônaco',circuit:'Circuit de Monaco',date:'2026-05-24',end:'2026-05-25',sprint:false,winner:null},
      {r:7,flag:'\ud83c\udde8\ud83c\udde6',gp:'GP do Canadá',circuit:'Circuit Gilles Villeneuve, Montreal',date:'2026-06-07',end:'2026-06-08',sprint:false,winner:null},
      {r:8,flag:'\ud83c\udde6\ud83c\uddf9',gp:'GP da Áustria',circuit:'Red Bull Ring, Spielberg',date:'2026-06-28',end:'2026-06-29',sprint:true,winner:null},
      {r:9,flag:'\ud83c\uddec\ud83c\udde7',gp:'GP da Grã-Bretanha',circuit:'Silverstone Circuit',date:'2026-07-05',end:'2026-07-06',sprint:false,winner:null},
      {r:10,flag:'\ud83c\udde7\ud83c\uddea',gp:'GP da Bélgica',circuit:'Circuit de Spa-Francorchamps',date:'2026-07-26',end:'2026-07-27',sprint:false,winner:null},
      {r:11,flag:'\ud83c\udded\ud83c\uddfa',gp:'GP da Hungria',circuit:'Hungaroring, Budapest',date:'2026-08-02',end:'2026-08-03',sprint:false,winner:null},
      {r:12,flag:'\ud83c\uddf3\ud83c\uddf1',gp:'GP da Holanda',circuit:'Circuit Zandvoort',date:'2026-08-30',end:'2026-08-31',sprint:false,winner:null},
      {r:13,flag:'\ud83c\uddee\ud83c\uddf9',gp:'GP da Itália',circuit:'Autodromo di Monza',date:'2026-09-06',end:'2026-09-07',sprint:false,winner:null},
      {r:14,flag:'\ud83c\udde6\ud83c\uddff',gp:'GP do Azerbaijão',circuit:'Baku City Circuit',date:'2026-09-20',end:'2026-09-21',sprint:false,winner:null},
      {r:15,flag:'\ud83c\uddf8\ud83c\uddec',gp:'GP de Singapura',circuit:'Marina Bay Street Circuit',date:'2026-10-04',end:'2026-10-05',sprint:false,winner:null},
      {r:16,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'GP dos EUA',circuit:'COTA, Austin',date:'2026-10-18',end:'2026-10-19',sprint:true,winner:null},
      {r:17,flag:'\ud83c\uddf2\ud83c\uddfd',gp:'GP do México',circuit:'Autódromo Hermanos Rodríguez',date:'2026-10-25',end:'2026-10-26',sprint:false,winner:null},
      {r:18,flag:'\ud83c\udde7\ud83c\uddf7',gp:'GP de São Paulo',circuit:'Autódromo de Interlagos',date:'2026-11-08',end:'2026-11-09',sprint:true,winner:null},
      {r:19,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'GP de Las Vegas',circuit:'Las Vegas Strip Circuit',date:'2026-11-21',end:'2026-11-22',sprint:false,winner:null},
      {r:20,flag:'\ud83c\uddf6\ud83c\udde6',gp:'GP do Qatar',circuit:'Lusail International Circuit',date:'2026-11-29',end:'2026-11-30',sprint:true,winner:null},
      {r:21,flag:'\ud83c\udde6\ud83c\uddea',gp:'GP de Abu Dhabi',circuit:'Yas Marina Circuit',date:'2026-12-06',end:'2026-12-07',sprint:false,winner:null}
    ]
  },
  motogp:{
    title:'Calendário MotoGP 2026', badge:'TEMPORADA 2026', sub:'Todas as corridas · Horários em BRT',
    source:'motogp.com · FIM',
    races:[
      {r:1,flag:'\ud83c\uddf9\ud83c\udded',gp:'GP da Tailândia',circuit:'Chang International Circuit, Buriram',date:'2026-03-01',end:'2026-03-02',sprint:true,winner:'Bagnaia'},
      {r:2,flag:'\ud83c\udde6\ud83c\uddf7',gp:'GP da Argentina',circuit:'Autódromo Termas de Río Hondo',date:'2026-03-15',end:'2026-03-16',sprint:true,winner:'Marc Márquez'},
      {r:3,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'GP das Américas',circuit:'COTA, Austin',date:'2026-04-12',end:'2026-04-13',sprint:true,winner:'Bagnaia'},
      {r:4,flag:'\ud83c\uddea\ud83c\uddf8',gp:'GP da Espanha',circuit:'Circuito de Jerez',date:'2026-04-26',end:'2026-04-27',sprint:true,winner:null},
      {r:5,flag:'\ud83c\uddeb\ud83c\uddf7',gp:'GP da França',circuit:'Le Mans, Bugatti Circuit',date:'2026-05-10',end:'2026-05-11',sprint:true,winner:null},
      {r:6,flag:'\ud83c\uddec\ud83c\udde7',gp:'GP da Grã-Bretanha',circuit:'Silverstone Circuit',date:'2026-05-24',end:'2026-05-25',sprint:true,winner:null},
      {r:7,flag:'\ud83c\uddf3\ud83c\uddf1',gp:'GP da Holanda',circuit:'TT Circuit Assen',date:'2026-06-28',end:'2026-06-29',sprint:true,winner:null},
      {r:8,flag:'\ud83c\udde9\ud83c\uddea',gp:'GP da Alemanha',circuit:'Sachsenring',date:'2026-07-12',end:'2026-07-13',sprint:true,winner:null},
      {r:9,flag:'\ud83c\udde6\ud83c\uddf9',gp:'GP da Áustria',circuit:'Red Bull Ring, Spielberg',date:'2026-08-16',end:'2026-08-17',sprint:true,winner:null},
      {r:10,flag:'\ud83c\uddea\ud83c\uddf8',gp:'GP de Aragón',circuit:'MotorLand Aragón',date:'2026-08-30',end:'2026-08-31',sprint:true,winner:null},
      {r:11,flag:'\ud83c\uddf8\ud83c\uddf2',gp:'GP de San Marino',circuit:'Misano World Circuit',date:'2026-09-13',end:'2026-09-14',sprint:true,winner:null},
      {r:12,flag:'\ud83c\uddee\ud83c\udde9',gp:'GP da Indonésia',circuit:'Mandalika Circuit, Lombok',date:'2026-09-27',end:'2026-09-28',sprint:true,winner:null},
      {r:13,flag:'\ud83c\uddef\ud83c\uddf5',gp:'GP do Japão',circuit:'Mobility Resort Motegi',date:'2026-10-04',end:'2026-10-05',sprint:true,winner:null},
      {r:14,flag:'\ud83c\udde6\ud83c\uddfa',gp:'GP da Austrália',circuit:'Phillip Island Circuit',date:'2026-10-18',end:'2026-10-19',sprint:true,winner:null},
      {r:15,flag:'\ud83c\uddf2\ud83c\uddfb',gp:'GP da Malásia',circuit:'Sepang International Circuit',date:'2026-11-01',end:'2026-11-02',sprint:true,winner:null},
      {r:16,flag:'\ud83c\uddea\ud83c\uddf8',gp:'GP de Valencia',circuit:'Circuit Ricardo Tormo',date:'2026-11-15',end:'2026-11-16',sprint:true,winner:null}
    ]
  },
  wec:{
    title:'Calendário WEC 2025-26', badge:'SUPERTEMPORADA', sub:'FIA World Endurance Championship · Hypercar',
    source:'fiawec.com · FIA',
    races:[
      {r:1,flag:'\ud83c\uddf6\ud83c\udde6',gp:'1812 km do Qatar',circuit:'Lusail International Circuit',date:'2026-02-28',end:'2026-03-01',sprint:false,winner:'Toyota #8'},
      {r:2,flag:'\ud83c\uddee\ud83c\uddf9',gp:'6h de Ímola',circuit:'Autodromo Enzo e Dino Ferrari',date:'2026-04-18',end:'2026-04-19',sprint:false,winner:null},
      {r:3,flag:'\ud83c\udde7\ud83c\uddea',gp:'6h de Spa',circuit:'Circuit de Spa-Francorchamps',date:'2026-05-09',end:'2026-05-10',sprint:false,winner:null},
      {r:4,flag:'\ud83c\uddeb\ud83c\uddf7',gp:'24 Horas de Le Mans',circuit:'Circuit de la Sarthe',date:'2026-06-13',end:'2026-06-14',sprint:false,winner:null},
      {r:5,flag:'\ud83c\udde7\ud83c\uddf7',gp:'6h de São Paulo',circuit:'Autódromo de Interlagos',date:'2026-07-12',end:'2026-07-13',sprint:false,winner:null},
      {r:6,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'6h de COTA',circuit:'Circuit of the Americas, Austin',date:'2026-09-05',end:'2026-09-06',sprint:false,winner:null},
      {r:7,flag:'\ud83c\uddef\ud83c\uddf5',gp:'6h do Fuji',circuit:'Fuji Speedway',date:'2026-10-10',end:'2026-10-11',sprint:false,winner:null},
      {r:8,flag:'\ud83c\udde7\ud83c\udded',gp:'8h do Bahrain',circuit:'Bahrain Intl Circuit, Sakhir',date:'2026-11-14',end:'2026-11-15',sprint:false,winner:null}
    ]
  },
  nascar:{
    title:'Calendário NASCAR Cup 2026', badge:'CUP SERIES 2026', sub:'NASCAR Cup Series · 36 corridas',
    source:'nascar.com · Jayski',
    races:[
      {r:1,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Daytona 500',circuit:'Daytona International Speedway',date:'2026-02-15',end:'2026-02-15',sprint:false,winner:'Larson'},
      {r:2,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Atlanta',circuit:'Atlanta Motor Speedway',date:'2026-02-22',end:'2026-02-22',sprint:false,winner:'Elliott'},
      {r:3,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Las Vegas',circuit:'Las Vegas Motor Speedway',date:'2026-03-01',end:'2026-03-01',sprint:false,winner:'Byron'},
      {r:4,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Phoenix',circuit:'Phoenix Raceway',date:'2026-03-08',end:'2026-03-08',sprint:false,winner:'Blaney'},
      {r:5,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Bristol',circuit:'Bristol Motor Speedway',date:'2026-03-22',end:'2026-03-22',sprint:false,winner:'Hamlin'},
      {r:6,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'COTA',circuit:'Circuit of the Americas, Austin',date:'2026-03-29',end:'2026-03-29',sprint:false,winner:'Chastain'},
      {r:7,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Richmond',circuit:'Richmond Raceway',date:'2026-04-05',end:'2026-04-05',sprint:false,winner:'Larson'},
      {r:8,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Martinsville',circuit:'Martinsville Speedway',date:'2026-04-12',end:'2026-04-12',sprint:false,winner:'Logano'},
      {r:9,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Texas',circuit:'Texas Motor Speedway',date:'2026-04-19',end:'2026-04-19',sprint:false,winner:null},
      {r:10,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Talladega',circuit:'Talladega Superspeedway',date:'2026-04-26',end:'2026-04-26',sprint:false,winner:null},
      {r:11,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Dover',circuit:'Dover Motor Speedway',date:'2026-05-03',end:'2026-05-03',sprint:false,winner:null},
      {r:12,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Kansas',circuit:'Kansas Speedway',date:'2026-05-10',end:'2026-05-10',sprint:false,winner:null},
      {r:13,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Darlington',circuit:'Darlington Raceway',date:'2026-05-17',end:'2026-05-17',sprint:false,winner:null},
      {r:14,flag:'\ud83c\uddfa\ud83c\uddf8',gp:'Charlotte 600',circuit:'Charlotte Motor Speedway',date:'2026-05-24',end:'2026-05-24',sprint:false,winner:null}
    ]
  },
  wrc:{
    title:'Calendário WRC 2026', badge:'TEMPORADA 2026', sub:'FIA World Rally Championship · 13 rallies',
    source:'wrc.com · FIA',
    races:[
      {r:1,flag:'\ud83c\uddf2\ud83c\udde8',gp:'Rallye Monte-Carlo',circuit:'Monaco / Gap / Col de Turini',date:'2026-01-22',end:'2026-01-25',sprint:false,winner:'Ogier'},
      {r:2,flag:'\ud83c\uddf8\ud83c\uddea',gp:'Rally da Suécia',circuit:'Umeå / Torsby',date:'2026-02-12',end:'2026-02-15',sprint:false,winner:'Rovanperä'},
      {r:3,flag:'\ud83c\uddf0\ud83c\uddea',gp:'Safari Rally Kenya',circuit:'Naivasha',date:'2026-03-26',end:'2026-03-29',sprint:false,winner:'Neuville'},
      {r:4,flag:'\ud83c\uddf5\ud83c\uddf9',gp:'Rally de Portugal',circuit:'Matosinhos / Fafe / Amarante',date:'2026-05-14',end:'2026-05-18',sprint:false,winner:null},
      {r:5,flag:'\ud83c\uddee\ud83c\uddf9',gp:'Rally da Sardenha',circuit:'Alghero / Olbia',date:'2026-06-04',end:'2026-06-07',sprint:false,winner:null},
      {r:6,flag:'\ud83c\uddec\ud83c\uddf7',gp:'Acrópolis Rally',circuit:'Lamia / Itea',date:'2026-06-25',end:'2026-06-28',sprint:false,winner:null},
      {r:7,flag:'\ud83c\uddea\ud83c\uddf8',gp:'Rally RACC Catalunya',circuit:'Salou / Tarragona',date:'2026-07-16',end:'2026-07-19',sprint:false,winner:null},
      {r:8,flag:'\ud83c\uddeb\ud83c\uddee',gp:'Rally da Finlândia',circuit:'Jyväskylä',date:'2026-07-30',end:'2026-08-02',sprint:false,winner:null},
      {r:9,flag:'\ud83c\udde8\ud83c\uddf1',gp:'Rally do Chile',circuit:'Concepción / Biobío',date:'2026-09-03',end:'2026-09-06',sprint:false,winner:null},
      {r:10,flag:'\ud83c\udde9\ud83c\uddea',gp:'Rally da Alemanha',circuit:'Bostalsee / Trier',date:'2026-10-08',end:'2026-10-11',sprint:false,winner:null},
      {r:11,flag:'\ud83c\uddef\ud83c\uddf5',gp:'Rally do Japão',circuit:'Toyota City / Aichi',date:'2026-11-12',end:'2026-11-15',sprint:false,winner:null}
    ]
  }
};

function renderCalendar(){
  const cat=activeCat||'f1';
  const cal=CAL_DATA[cat]||CAL_DATA.f1;
  const races=cal.races;

  // Update hero
  const heroTitle=document.querySelector('#view-calendar .cal-hero-title');
  const heroBadge=document.querySelector('#view-calendar .badge');
  const heroSub=document.querySelector('#view-calendar .cal-hero-sub');
  if(heroTitle) heroTitle.textContent=cal.title;
  if(heroBadge) heroBadge.textContent=cal.badge;
  if(heroSub) heroSub.textContent=cal.sub;

  const now=new Date();
  const grid=document.getElementById('calGrid');
  if(!grid) return;

  let nextFound=false;
  grid.innerHTML=races.map(rc=>{
    const raceEnd=new Date(rc.end+'T23:59:59');
    const raceStart=new Date(rc.date+'T00:00:00');
    const isDone=now>raceEnd;
    const isNow=now>=raceStart&&now<=raceEnd;
    const isNext=!isDone&&!isNow&&!nextFound;
    if(isNext) nextFound=true;

    const status=isDone?'done':(isNow||isNext)?'next':'';
    const dateStr=formatCalDate(rc.date, rc.end);

    let badges=`<span class="cal-badge">RONDA ${rc.r}</span>`;
    if(rc.sprint) badges+=`<span class="cal-badge sprint"><i class="fi fi-rr-bolt"></i> SPRINT</span>`;
    if(isDone) badges+=`<span class="cal-badge done-badge"><i class="fi fi-rr-check"></i></span>`;

    const winnerHtml=isDone&&rc.winner?`<div class="cal-winner"><i class="fi fi-rr-trophy"></i> Vencedor: <strong>${rc.winner}</strong></div>`:'';

    return `<div class="cal-card ${status}" onclick="toast('${rc.gp} \u2014 ${dateStr}','info')">
      <div class="cal-top">
        <span class="cal-flag">${rc.flag}</span>
        <div>
          <div class="cal-gp">${rc.gp}</div>
          <div class="cal-circuit">${rc.circuit}</div>
        </div>
      </div>
      <div class="cal-body">
        <div>
          <div class="cal-date">${dateStr}</div>
          <div class="cal-round">Ronda ${rc.r} de ${races.length}</div>
        </div>
        <div class="cal-badges">${badges}</div>
      </div>
      ${winnerHtml}
    </div>`;
  }).join('');

  const done=races.filter(r=>now>new Date(r.end+'T23:59:59')).length;
  const unit=cat==='wrc'?'Rallies':'Corridas';
  document.getElementById('calTitle').textContent=`${races.length} ${unit} \u00b7 ${done} conclu\u00edda${done!==1?'s':''}`;
}

function formatCalDate(start,end){
  const s=new Date(start+'T12:00:00');
  const e=new Date(end+'T12:00:00');
  const months=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  if(s.getMonth()===e.getMonth()){
    return `${s.getDate()}-${e.getDate()} ${months[s.getMonth()]}`;
  }
  return `${s.getDate()} ${months[s.getMonth()]} - ${e.getDate()} ${months[e.getMonth()]}`;
}

/* ══════════════════════════════════════════
   FULL STANDINGS
══════════════════════════════════════════ */
const FULL_DRIVERS=[
  {pos:1,flag:'🇮🇹',name:'Antonelli',team:'Mercedes-AMG Petronas',pts:72,color:'#00d2be'},
  {pos:2,flag:'🇬🇧',name:'Russell',team:'Mercedes-AMG Petronas',pts:63,color:'#00d2be'},
  {pos:3,flag:'🇲🇨',name:'Leclerc',team:'Scuderia Ferrari',pts:49,color:'#dc0000'},
  {pos:4,flag:'🇬🇧',name:'Hamilton',team:'Scuderia Ferrari',pts:41,color:'#dc0000'},
  {pos:5,flag:'🇬🇧',name:'Norris',team:'McLaren Mercedes',pts:25,color:'#ff8000'},
  {pos:6,flag:'🇦🇺',name:'Piastri',team:'McLaren Mercedes',pts:21,color:'#ff8000'},
  {pos:7,flag:'🇬🇧',name:'Bearman',team:'MoneyGram Haas',pts:17,color:'#aaaaaa'},
  {pos:8,flag:'🇫🇷',name:'Gasly',team:'BWT Alpine',pts:15,color:'#0093cc'},
  {pos:9,flag:'🇳🇱',name:'Verstappen',team:'Red Bull Ford',pts:12,color:'#3671c6'},
  {pos:10,flag:'🇳🇿',name:'Lawson',team:'Racing Bulls Ford',pts:10,color:'#4e7cbf'},
  {pos:11,flag:'🇫🇷',name:'Doohan',team:'BWT Alpine',pts:8,color:'#0093cc'},
  {pos:12,flag:'🇩🇪',name:'Hülkenberg',team:'Audi',pts:6,color:'#c0c0c0'},
  {pos:13,flag:'🇹🇭',name:'Albon',team:'Williams Mercedes',pts:5,color:'#64c4ff'},
  {pos:14,flag:'🇨🇦',name:'Stroll',team:'Aston Martin Mercedes',pts:4,color:'#006f62'},
  {pos:15,flag:'🇪🇸',name:'Alonso',team:'Aston Martin Mercedes',pts:3,color:'#006f62'},
  {pos:16,flag:'🇺🇸',name:'Ocon',team:'MoneyGram Haas',pts:2,color:'#aaaaaa'},
  {pos:17,flag:'🇦🇷',name:'Colapinto',team:'Williams Mercedes',pts:1,color:'#64c4ff'},
  {pos:18,flag:'🇯🇵',name:'Tsunoda',team:'Red Bull Ford',pts:1,color:'#3671c6'},
  {pos:19,flag:'🇧🇷',name:'Bortoleto',team:'Audi',pts:0,color:'#c0c0c0'},
  {pos:20,flag:'🇬🇧',name:'Hadjar',team:'Racing Bulls Ford',pts:0,color:'#4e7cbf'}
];

const FULL_CONSTRUCTORS=[
  {pos:1,flag:'🇩🇪',name:'Mercedes-AMG Petronas',team:'Mercedes',pts:135,color:'#00d2be'},
  {pos:2,flag:'🇮🇹',name:'Scuderia Ferrari',team:'Ferrari',pts:90,color:'#dc0000'},
  {pos:3,flag:'🇬🇧',name:'McLaren',team:'Mercedes',pts:46,color:'#ff8000'},
  {pos:4,flag:'🇺🇸',name:'MoneyGram Haas',team:'Ferrari',pts:19,color:'#aaaaaa'},
  {pos:5,flag:'🇫🇷',name:'BWT Alpine',team:'Mercedes',pts:23,color:'#0093cc'},
  {pos:6,flag:'🇦🇹',name:'Red Bull Racing',team:'Ford',pts:13,color:'#3671c6'},
  {pos:7,flag:'🇮🇹',name:'Racing Bulls',team:'Ford',pts:10,color:'#4e7cbf'},
  {pos:8,flag:'🇬🇧',name:'Aston Martin',team:'Mercedes',pts:7,color:'#006f62'},
  {pos:9,flag:'🇬🇧',name:'Williams',team:'Mercedes',pts:6,color:'#64c4ff'},
  {pos:10,flag:'🇩🇪',name:'Audi',team:'Audi',pts:6,color:'#c0c0c0'}
];

function renderFullStandings(tab,btnEl){
  const data=tab==='drv'?FULL_DRIVERS:FULL_CONSTRUCTORS;
  const maxPts=data[0]?.pts||1;
  const grid=document.getElementById('fullStandGrid');
  if(!grid)return;

  if(btnEl){
    document.querySelectorAll('.fs-tab').forEach(t=>t.classList.remove('active'));
    btnEl.classList.add('active');
  }

  grid.innerHTML=data.map(d=>{
    const pClass=d.pos<=3?'p'+d.pos:'';
    const barW=maxPts>0?Math.round((d.pts/maxPts)*100):0;
    return `<div class="fs-row ${pClass}" style="--team-color:${d.color}">
      <div class="fs-pos">${d.pos}</div>
      <div class="fs-flag">${d.flag}</div>
      <div class="fs-info">
        <div class="fs-name">${d.name}</div>
        <div class="fs-team">${d.team}</div>
      </div>
      <div class="fs-bar-wrap">
        <div class="fs-bar-bg"><div class="fs-bar" style="width:${barW}%"></div></div>
      </div>
      <div class="fs-pts">${d.pts}</div>
    </div>`;
  }).join('');
}


function renderHero(rssFeed, saasFeed) {
  const f1 = rssFeed.find(x => x.cat === 'f1' || x.cat === 'F1');
  const moto = rssFeed.find(x => x.cat === 'motogp' || x.cat === 'MotoGP');
  const saas = saasFeed && saasFeed.length > 0 ? saasFeed[0] : null;

  // Se nao houver SaaS, pegamos a proxima noticia de endurance/stockcar ou qualquer
  const thirdSlot = saas || rssFeed.find(x => x.id !== (f1?f1.id:null) && x.id !== (moto?moto.id:null));

  const buildMain = (a) => {
    if(!a) return '';
    const click = a.isReal ? `extLink('${a.link}')` : `openArticle('${a.id}')`;
    const typLabel = a.isReal ? `<div class="hero-type ext"><i class="fi fi-rr-link"></i> HUB ORIGINAL</div>` : `<div class="hero-type int"><i class="fi fi-rr-pencil"></i> DRIVER NEWS</div>`;
    const exc = a.body ? a.body.replace(/<[^>]*>?/gm, '').substring(0, 110) + '...' : '';
    return `
      <img src="${a.img}" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
      <div class="hero-content" style="z-index:2; position:relative; pointer-events:none;">
        ${typLabel}
        <span class="badge ${a.badge}">${a.cat.toUpperCase()}</span>
        <h1 class="hero-title">${a.title}</h1>
        <p class="hero-excerpt">${exc}</p>
        <div class="hero-meta"><span>${a.author}</span><span>${a.date}</span></div>
      </div>
      <div style="position:absolute; inset:0; z-index:5; cursor:pointer;" onclick="${click}"></div>
    `;
  };

  const buildSide = (a, isVip) => {
    if(!a) return '';
    const click = a.isReal ? `extLink('${a.link}')` : `openArticle('${a.id}')`;
    const typLabel = isVip ? `<div class="hero-type int" style="color:#d9a05b;border-color:#d9a05b"><i class="fi fi-rr-member-vip"></i> PILOTO VERIFICADO</div>` : (a.isReal ? `<div class="hero-type ext"><i class="fi fi-rr-link"></i> CURADORIA</div>` : `<div class="hero-type int"><i class="fi fi-rr-pencil"></i> DRIVER NEWS</div>`);
    
    return `
      <img src="${a.img}" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
      <div class="side-content" style="z-index:2; position:relative; pointer-events:none;">
        <div style="margin-bottom:5px">${typLabel}</div>
        <span class="badge ${a.badge}">${a.cat.toUpperCase()}</span>
        <div class="side-title">${a.title}</div>
        <div class="side-meta">${isVip ? 'ACESSE O PERFIL ↗' : 'LER MATÉRIA ↗'}</div>
      </div>
      <div style="position:absolute; inset:0; z-index:5; cursor:pointer;" onclick="${click}"></div>
    `;
  };

  const hMain = document.getElementById('hero-main');
  const hSide1 = document.getElementById('hero-side1');
  const hSide2 = document.getElementById('hero-side2');

  if(hMain && f1) {
    hMain.innerHTML = buildMain(f1);
    hMain.style.position = 'relative'; // garante q o cursor onclick area funcione
    hMain.style.overflow = 'hidden';
  }
  if(hSide1 && moto) {
    hSide1.innerHTML = buildSide(moto, false);
    hSide1.style.position = 'relative';
    hSide1.style.overflow = 'hidden';
  }
  if(hSide2 && thirdSlot) {
    hSide2.innerHTML = buildSide(thirdSlot, !!saas); // isVip=true se for o SaaS
    hSide2.style.position = 'relative';
    hSide2.style.overflow = 'hidden';
  }
}

