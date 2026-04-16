(function () {
  const KEY = 'dn_cookie_v3';
  if (localStorage.getItem(KEY)) return;
  const el = document.createElement('div');
  el.id = 'dn-cookie-banner';
  el.innerHTML = `<div style="position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#08080f;border-top:2px solid #e8002d;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:'DM Sans',sans-serif;font-size:13px;color:#8888a0;box-shadow:0 -4px 30px rgba(0,0,0,.6)"><p style="flex:1;min-width:240px;margin:0;line-height:1.6">
  Usamos cookies essenciais e de analytics. Ao continuar você consente conforme a <a href="politica.html" style="color:#e8002d">Política de Privacidade (LGPD)</a>.</p><div style="display:flex;gap:10px;flex-shrink:0"><button id="dn-ck-ess" style="background:transparent;border:1px solid #424258;color:#8888a0;padding:8px 16px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:6px;font-family:inherit">Só essenciais</button><button id="dn-ck-ok" style="background:#e8002d;border:none;color:#fff;padding:8px 22px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:6px;font-family:inherit">Aceitar</button></div></div>`;
  document.body.appendChild(el);
  const save = v => { localStorage.setItem(KEY, v); localStorage.setItem(KEY+'_ts', new Date().toISOString()); document.getElementById('dn-cookie-banner').remove(); };
  document.getElementById('dn-ck-ok').onclick = () => save('all');
  document.getElementById('dn-ck-ess').onclick = () => save('essential');
})();
