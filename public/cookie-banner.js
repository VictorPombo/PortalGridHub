(function () {
  var KEY = 'dn_cookie_v3';
  if (localStorage.getItem(KEY)) return;
  if (document.getElementById('dn-cookie-banner')) return;

  var el = document.createElement('div');
  el.id = 'dn-cookie-banner';
  el.innerHTML = '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
    'background:rgba(10,10,15,0.97);border-top:1px solid rgba(232,0,45,0.3);' +
    'padding:16px 24px;display:flex;align-items:center;justify-content:space-between;' +
    'flex-wrap:wrap;gap:12px;font-family:Inter,sans-serif;font-size:12px;color:#aaa;">' +
    '<span>Usamos cookies essenciais para o funcionamento do site e cookies de análise ' +
    'para melhorar sua experiência. Ao continuar navegando, você concorda com nossa ' +
    '<a href="/politica.html" style="color:#e8002d;text-decoration:underline;">Política de Privacidade</a>.</span>' +
    '<div style="display:flex;gap:8px;">' +
    '<button id="dn-ck-ok" style="background:#e8002d;color:#fff;border:none;padding:6px 16px;' +
    'border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;">Aceitar todos</button>' +
    '<button id="dn-ck-ess" style="background:transparent;color:#888;border:1px solid #333;' +
    'padding:6px 16px;border-radius:4px;cursor:pointer;font-size:11px;">Apenas essenciais</button>' +
    '</div></div>';

  document.body.appendChild(el);

  function save(v) {
    try {
      localStorage.setItem(KEY, v);
      localStorage.setItem(KEY + '_ts', new Date().toISOString());
    } catch(e) {}
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  var btnOk = document.getElementById('dn-ck-ok');
  var btnEss = document.getElementById('dn-ck-ess');
  
  if (btnOk) {
    btnOk.addEventListener('click', function(e) { e.preventDefault(); save('all'); }, {passive: false});
    btnOk.addEventListener('touchstart', function(e) { e.preventDefault(); save('all'); }, {passive: false});
  }
  if (btnEss) {
    btnEss.addEventListener('click', function(e) { e.preventDefault(); save('essential'); }, {passive: false});
    btnEss.addEventListener('touchstart', function(e) { e.preventDefault(); save('essential'); }, {passive: false});
  }
})();
