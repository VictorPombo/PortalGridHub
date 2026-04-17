/* =====================================================
   DRIVER NEWS — CORE SHARED JS
   ===================================================== */

/* ====== TOAST ====== */
function showToast(msg, type='info') {
  const w = document.getElementById('toastWrap') || document.getElementById('toasts');
  if(!w) return;
  const t = document.createElement('div');
  t.className = 'toast' + (type==='ok'?' ok':type==='err'?' err':'');
  t.textContent = msg;
  w.appendChild(t);
  setTimeout(()=>{ t.classList.add('show'); }, 10);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),400); }, 3500);
}

/* ====== MODAL OPEN/CLOSE ====== */
function openModal(id) {
  const el = document.getElementById(id);
  if(el) { el.classList.add('open'); document.body.classList.add('locked'); }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if(el) { el.classList.remove('open'); document.body.classList.remove('locked'); }
}

/* ====== MOBILE MENU ====== */
function openMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('open');
  document.getElementById('mobileOverlay')?.classList.add('show');
  document.body.classList.add('locked');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('show');
  document.body.classList.remove('locked');
}

/* ====== PROGRESS BAR ====== */
function initProgressBar() {
  window.addEventListener('scroll', ()=>{
    const s = document.documentElement;
    const pgbar = document.getElementById('pgbar');
    const btt = document.getElementById('btt');
    if(pgbar) pgbar.style.width = (s.scrollTop/(s.scrollHeight-window.innerHeight)*100)+'%';
    if(btt) btt.classList.toggle('visible', window.scrollY > 600);
  });
}

/* ====== SCROLL REVEAL ====== */
function initReveal() {
  const revObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:0.07});
  document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
}

/* ====== EMAIL VALIDATION ====== */
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

/* ====== SCROLL TO TOP ====== */
function scrollToTop() { window.scrollTo({top:0,behavior:'smooth'}); }

/* ====== SHARE ====== */
function shareContent(platform) {
  const url = window.location.href;
  if(platform==='x') { showToast('Abrindo Twitter/X...'); }
  else if(platform==='whatsapp') { showToast('Abrindo WhatsApp...'); }
  else if(platform==='link') {
    navigator.clipboard?.writeText(url).then(()=>showToast('✓ Link copiado!','ok')).catch(()=>showToast('✓ Link copiado!','ok'));
  } else { showToast('Compartilhando...'); }
}

/* ====== KEYBOARD SHORTCUTS ====== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e=>{
    if((e.metaKey||e.ctrlKey)&&e.key==='k'){ e.preventDefault(); if(typeof openSearch==='function') openSearch(); }
    if(e.key==='Escape'){
      closeMobileMenu();
      ['subOverlay','videoOverlay','articleOverlay','searchOverlay'].forEach(id=>{
        const el = document.getElementById(id);
        if(el && el.classList.contains('open')) closeModal(id);
      });
    }
  });
}

/* ====== FAQ TOGGLE ====== */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q=>{
    q.addEventListener('click', ()=>{
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
}

/* ====== TOGGLE ====== */

/* ══ CATEGORY PICKER ══ */
function renderCategoryPicker(containerId, initialSelected = []) {
  if (typeof Driver === 'undefined' || !Driver.RACING_CATEGORIES) return;
  const container = document.getElementById(containerId);
  if (!container) return;

  const cats = Driver.RACING_CATEGORIES;
  let html = `<div class="cat-picker">`;
  
  // Backward compatibility filter
  const oldCats = initialSelected.filter(s => typeof s === 'string' && !s.includes(' - '));
  
  for (const group in cats) {
    const subcats = cats[group];
    const selCount = subcats.filter(s => initialSelected.includes(`${group} - ${s}`) || oldCats.includes(s)).length;
    
    html += `
      <div class="cat-picker-group">
        <div class="cat-picker-head" onclick="this.nextElementSibling.classList.toggle('open')">
          <span>${group}</span>
          ${selCount > 0 ? `<span class="qty">${selCount}</span>` : ''}
        </div>
        <div class="cat-picker-body">
    `;
    
    subcats.forEach(sub => {
      const val = `${group} - ${sub}`;
      const checked = (initialSelected.includes(val) || initialSelected.includes(sub)) ? 'checked' : '';
      html += `
          <div class="cat-checkbox-wrap">
            <input type="checkbox" value="${val}" id="chk_${val.replace(/\W/g,'')}" class="cat-chk" ${checked}>
            <label for="chk_${val.replace(/\W/g,'')}">${sub}</label>
          </div>
      `;
    });
    
    html += `</div></div>`;
  }
  
  html += `
    <div class="cat-picker-group">
      <div class="cat-picker-head">
        <span style="font-size:12px;color:rgba(255,255,255,0.7)">Outra Categoria (Opcional)</span>
      </div>
      <div style="padding:10px 16px;">
        <input type="text" class="cat-chk-custom" placeholder="Digite sua categoria..." style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:10px;border-radius:4px;font-family:var(--fm)">
      </div>
    </div>
  </div>`;
  container.innerHTML = html;
  
  const chks = container.querySelectorAll('.cat-chk');
  chks.forEach(chk => {
    chk.addEventListener('change', () => {
      const g = chk.closest('.cat-picker-group');
      const headQty = g.querySelector('.qty');
      const count = g.querySelectorAll('.cat-chk:checked').length;
      if (count > 0) {
        if (headQty) headQty.innerText = count;
        else g.querySelector('.cat-picker-head').insertAdjacentHTML('beforeend', `<span class="qty">${count}</span>`);
      } else {
        if (headQty) headQty.remove();
      }
    });
  });
  
  // Custom category injection
  const customInput = container.querySelector('.cat-chk-custom');
  if(customInput) {
     const custVal = oldCats.filter(c => !Object.values(cats).flat().includes(c));
     if(custVal.length > 0) customInput.value = custVal[0];
  }
}

function getSelectedCategories() {
  const chks = document.querySelectorAll('.cat-chk:checked');
  const arr = Array.from(chks).map(c => c.value);
  const customs = document.querySelectorAll('.cat-chk-custom');
  customs.forEach(c => {
    if(c.value.trim()) arr.push(c.value.trim());
  });
  return arr;
}
function initToggles() {
  document.querySelectorAll('.toggle').forEach(t=>{
    t.addEventListener('click', ()=>{
      t.classList.toggle('on');
      showToast(t.classList.contains('on') ? '✓ Ativado' : 'Desativado', t.classList.contains('on') ? 'ok' : 'info');
    });
  });
}

/* ====== TABS ====== */
function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.target;
        if(target) {
          group.parentElement.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          const panel = document.getElementById(target);
          if(panel) panel.classList.add('active');
        }
      });
    });
  });
}

/* ====== NAV TEMPLATE ====== */
function getNavHTML(activePage) {
  return `
  <nav>
    <div class="nav-inner">
      <a class="logo" href="index.html">
        <div class="logo-badge">
          <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>
        </div>
        <div class="logo-text">
          <span class="logo-name">Driver</span>
          <span class="logo-tag">News</span>
        </div>
      </a>
      <ul class="nav-links">
        <li><a href="index.html" class="${activePage==='home'?'active':''}">Início</a></li>
        <li><a href="index.html#newsSection" class="${activePage==='news'?'active':''}">Notícias</a></li>
        <li><a href="piloto.html" class="${activePage==='pilotos'?'active':''}">Pilotos</a></li>
        <li><a href="index.html?view=plans" class="${activePage==='planos'?'active':''}">Planos</a></li>
      </ul>
      <div class="nav-right">
        <span class="live-pill" title="Ao vivo">Ao Vivo</span>
        <button class="btn-search" title="Buscar (Ctrl+K)" onclick="if(typeof openSearch==='function')openSearch()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <a href="cadastro.html" class="btn-nav-action">Entrar</a>
        <button class="btn-hamburger" onclick="openMobileMenu()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>`;
}

/* ====== FOOTER TEMPLATE ====== */
function getFooterHTML() {
  return `
  <footer>
    <div class="f-inner">
      <div class="f-grid">
        <div>
          <div class="f-logo"><div class="dot"></div>Driver News</div>
          <p class="f-desc">O portal de referência em automobilismo no Brasil. Mídia digital para pilotos, equipes e categorias que buscam visibilidade e patrocinadores.</p>
          <div class="f-social">
            <div class="f-soc" onclick="shareContent('x')" title="Twitter/X">X</div>
            <div class="f-soc" title="Instagram">IG</div>
            <div class="f-soc" title="YouTube">YT</div>
            <div class="f-soc" title="TikTok">TK</div>
          </div>
        </div>
        <div class="f-col">
          <h4>Plataforma</h4>
          <ul>
            <li><a href="index.html?view=plans">Planos e Preços</a></li>
            <li><a href="cadastro.html">Criar Conta</a></li>
            <li><a href="piloto.html">Ver Pilotos</a></li>
          </ul>
        </div>
        <div class="f-col">
          <h4>Categorias</h4>
          <ul>
            <li><a href="index.html">Fórmula 1</a></li>
            <li><a href="index.html">MotoGP</a></li>
            <li><a href="index.html">WEC / Le Mans</a></li>
            <li><a href="index.html">Sim Racing</a></li>
          </ul>
        </div>
        <div class="f-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="politica.html">Política de Privacidade</a></li>
            <li><a href="termos.html">Termos de Uso</a></li>
            <li><a href="mailto:contato@drivernews.com.br">Contato</a></li>
          </ul>
        </div>
      </div>
      <div class="f-bottom">
        <div class="f-copy">© 2026 DRIVER MEDIA · TODOS OS DIREITOS RESERVADOS</div>
        <div class="f-love">FEITO COM ❤ PARA QUEM AMA O ESPORTE</div>
      </div>
    </div>
  </footer>`;
}

/* ====== INIT COMMON ====== */
function initCommon() {
  initProgressBar();
  initReveal();
  initKeyboardShortcuts();
  initFAQ();
  initToggles();
  initTabs();
}

document.addEventListener('DOMContentLoaded', initCommon);

// Load Lucide Icons
const lucideScript = document.createElement('script');
lucideScript.src = "https://unpkg.com/lucide@latest";
lucideScript.onload = () => {
  if (window.lucide) {
    window.lucide.createIcons();
    
    // Observer for dynamically added icons (like in state.js renders)
    let isCreatingIcons = false;
    const observer = new MutationObserver((mutations) => {
      // Prevent infinite loop from createIcons() adding SVGs to the DOM
      if (isCreatingIcons) return;
      
      let hasNewLucideTag = false;
      mutations.forEach(m => {
        if (m.type === 'childList') {
           m.addedNodes.forEach(node => {
               if (node.nodeType === 1) { // ELEMENT_NODE
                   // Check if the added node itself is a lucide tag or contains one
                   if (node.hasAttribute('data-lucide') || node.querySelector('[data-lucide]')) {
                       hasNewLucideTag = true;
                   }
               }
           });
        }
      });
      
      if (hasNewLucideTag && window.lucide) {
        isCreatingIcons = true;
        window.lucide.createIcons();
        // Allow the browser to paint and finish DOM updates before unlocking
        setTimeout(() => { isCreatingIcons = false; }, 10);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
};
document.head.appendChild(lucideScript);

// ════════════════════════════════════════
// COUNTER ANIMATION (Landing Page Stats)
// ════════════════════════════════════════
function animateCounters(){
  document.querySelectorAll('.lp-stat-num[data-target]').forEach(function(el){
    var target=parseInt(el.dataset.target);
    var prefix=el.dataset.prefix||'';
    var suffix=el.dataset.suffix||'';
    var duration=2000;
    var start=performance.now();
    function update(now){
      var progress=Math.min((now-start)/duration,1);
      var eased=1-Math.pow(1-progress,3);
      var current=Math.floor(eased*target);
      el.textContent=prefix+current.toLocaleString('pt-BR')+suffix;
      if(progress<1)requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}
var _cntDone=false;
var statsEl=document.querySelector('.lp-stats');
if(statsEl){
  var cntObs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting&&!_cntDone){_cntDone=true;animateCounters();cntObs.disconnect();}
    });
  },{threshold:0.3});
  cntObs.observe(statsEl);
}

// ════════════════════════════════════════
// SCROLL REVEAL (Landing Page Sections)
// ════════════════════════════════════════
var revObs=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting)entry.target.classList.add('revealed');
  });
},{threshold:0.08});
document.querySelectorAll('#view-plans .lp-section').forEach(function(s){
  s.classList.add('reveal-section');
  revObs.observe(s);
});
