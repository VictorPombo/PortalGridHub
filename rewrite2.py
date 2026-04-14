import re

html_content = """<div class="view" id="view-plans">
  <!-- 🏁 HERO -->
  <section class="lp-section no-border lp-hero">
    <div class="lp-inner">
      <h1 class="lp-title" style="font-size:72px">Pare de parecer amador fora da pista.</h1>
      
      <p class="lp-subtitle center" style="margin-bottom:20px;font-size:22px">Você investe na sua carreira como piloto.<br>Mas ainda se apresenta com prints, PDFs perdidos e stories que somem em 24h.</p>
      
      <p class="lp-subtitle center" style="margin-bottom:40px;font-size:18px;color:#8888a0">O PitLane transforma suas atualizações em uma presença profissional — com matérias, página própria e um link pronto pra enviar pra qualquer patrocinador.</p>
      
      <div class="lp-btns" style="margin-top:40px">
        <button class="btn btn-acc lp-btn-pri" style="font-size:18px;padding:15px 36px" onclick="showView('login')">Criar meu perfil profissional</button>
        <button class="btn btn-out" style="font-size:18px;padding:15px 36px;border-color:rgba(255,255,255,0.2);color:#FFF" onclick="toast('Encaminhando para o WhatsApp','info'); window.open('https://wa.me/5511999999999?text=Quero%20criar%20meu%20perfil%20profissional%20no%20PitLane')">Falar no WhatsApp</button>
      </div>
      
      <div class="lp-trust-bar" style="margin-top:60px;opacity:0.4">
        <div class="lp-trust-logos" style="justify-content:center;gap:30px">
          <span>ESPN</span><span style="opacity:0.5">•</span><span>Sky Sports</span><span style="opacity:0.5">•</span><span>Motorsport.com</span><span style="opacity:0.5">•</span><span>GPFans</span><span style="opacity:0.5">•</span><span>Autosport</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ⚠️ PROBLEMA -->
  <section class="lp-section lp-dark">
    <div class="lp-inner">
      <div class="lp-grid-4">
        <div class="lp-pain-card lp-glass">
          <p>Você manda mensagem pra patrocinador e <b>fica no vácuo</b></p>
        </div>
        <div class="lp-pain-card lp-glass">
          <p>Seu mídia kit é um <b>PDF perdido</b> no WhatsApp</p>
        </div>
        <div class="lp-pain-card lp-glass">
          <p>Seus resultados <b>somem em 24h</b> no Instagram</p>
        </div>
        <div class="lp-pain-card lp-glass">
          <p>Você investe na pista, mas <b>não na sua apresentação</b></p>
        </div>
      </div>
      <div style="text-align:center;margin-top:60px">
        <p style="font-size:24px;color:#f0f0f5;font-weight:bold;font-family:var(--fb)">👉 Você corre como profissional.<br>Mas se apresenta como amador.</p>
      </div>
    </div>
  </section>

  <!-- 🚀 SOLUÇÃO -->
  <section class="lp-section">
    <div class="lp-inner">
      <div class="lp-grid-4">
        <div class="lp-card lp-glass">
          <h3 style="font-family:var(--fd);font-size:24px;color:#f0a000">Matérias profissionais</h3>
          <p>Conteúdo jornalístico publicando suas conquistas da pista.</p>
        </div>
        <div class="lp-card lp-glass">
          <h3 style="font-family:var(--fd);font-size:24px;color:#f0a000">Página do piloto</h3>
          <p>Perfil estruturado centralizando sua carreira esportiva em link.</p>
        </div>
        <div class="lp-card lp-glass">
          <h3 style="font-family:var(--fd);font-size:24px;color:#f0a000">Mídia kit automático</h3>
          <p>Apresentação imediata de marca e retorno ao investidor.</p>
        </div>
        <div class="lp-card lp-glass">
          <h3 style="font-family:var(--fd);font-size:24px;color:#f0a000">Painel de controle</h3>
          <p>Gestão de visões unificadas para dominar seus deals.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ⚙️ COMO FUNCIONA -->
  <section class="lp-section lp-dark">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:60px;font-size:42px">⚙️ COMO FUNCIONA</h2>
      <div class="lp-steps flex-layout">
        <div class="lp-step-box">
          <div class="lp-num">1</div>
          <p>Acessa painel</p>
        </div>
        <div class="lp-step-box">
          <div class="lp-num">2</div>
          <p>Envia fotos + texto simples</p>
        </div>
        <div class="lp-step-box ai-focus">
          <div class="lp-num" style="background:#e8002d">3</div>
          <p style="color:#FFF;font-weight:bold">IA transforma em matéria</p>
        </div>
        <div class="lp-step-box">
          <div class="lp-num">4</div>
          <p>Aprova ou ajusta</p>
        </div>
        <div class="lp-step-box">
          <div class="lp-num">5</div>
          <p>Publica e usa o link</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 🧪 DEMONSTRAÇÃO -->
  <section class="lp-section">
    <div class="lp-inner">
      <div class="lp-grid-3 demo-cards">
        <div class="lp-card lp-glass demo-card">
          <div class="demo-badge">EXEMPLO</div>
          <div class="demo-content">
            <h4 style="font-family:var(--fd);font-size:20px;margin-bottom:15px">Painel</h4>
            <div class="mock-pnl-line">Lucas Ferreira · Piloto F4</div>
            <div class="mock-pnl-box">Stats Tracker</div>
            <div class="mock-pnl-box">Status Ativo</div>
          </div>
        </div>

        <div class="lp-card lp-glass demo-card">
          <div class="demo-badge">EXEMPLO</div>
          <div class="demo-content">
            <h4 style="font-family:var(--fd);font-size:20px;margin-bottom:15px">Matéria</h4>
            <div class="mock-mat-title">PitLane News: Título Corrida</div>
            <div class="mock-mat-txt">Corpo jornalístico otimizado pela Inteligência da redação...</div>
            <div class="mock-mat-tags"><span>Tags</span> <span>Leitura</span></div>
          </div>
        </div>

        <div class="lp-card lp-glass demo-card">
          <div class="demo-badge">EXEMPLO</div>
          <div class="demo-content">
            <h4 style="font-family:var(--fd);font-size:20px;margin-bottom:15px">Página</h4>
            <div class="mock-pg-photo"></div>
            <div class="mock-pg-txt">Bio + Estatísticas</div>
            <div class="mock-pg-cotas">Cotas · Botão Contato</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 🧩 QUANDO USAR & 🏎️ PARA QUEM É -->
  <section class="lp-section lp-dark">
    <div class="lp-inner">
      <div class="lp-grid-2">
        <div class="lp-block">
          <h2 class="lp-title" style="font-size:42px">QUANDO USAR</h2>
          <ul class="lp-list">
            <li>Antes de mandar proposta</li>
            <li>Depois de corrida</li>
            <li>Quando pedem material</li>
            <li>Quando quer ser levado a sério</li>
          </ul>
        </div>
        
        <div class="lp-block">
           <h2 class="lp-title" style="font-size:42px">PARA QUEM É</h2>
           <p style="font-size:18px;font-family:var(--fb);color:#8888a0;line-height:1.6;margin-bottom:20px">F4, Stock Car, Porsche Cup, Kart, Endurance, Drift e todas as ligas profissionais e amadoras ativas.</p>
           <h3 style="font-size:28px;font-family:var(--fd);margin:0;color:#f0f0f5">"Se você compete, isso é pra você."</h3>
        </div>
      </div>
    </div>
  </section>

  <!-- ⚡ DIFERENCIAL & 🔄 ANTES vs DEPOIS -->
  <section class="lp-section">
    <div class="lp-inner">
      <div class="lp-grid-2" style="margin-bottom:40px">
        <div class="lp-block">
          <h2 class="lp-title" style="font-size:32px">O ATIVO REAL</h2>
          <ul class="lp-list no-icon" style="color:#00bb55;font-weight:bold">
            <li>Sem depender de algoritmo</li>
            <li>Controle total do nome</li>
            <li>Link como ativo imortal</li>
            <li>Posicionamento profissional</li>
          </ul>
        </div>
        <div class="lp-block">
           <div class="ad-cards">
            <div class="ad-col sem">
              <div class="ad-title" style="color:#8888a0">SEM PITLANE</div>
              <div class="ad-item">PDF ignorado</div>
              <div class="ad-item">Stories somem</div>
              <div class="ad-item">Sem estrutura</div>
            </div>
            <div class="ad-col com">
              <div class="ad-title" style="color:#f0f0f5">COM PITLANE</div>
              <div class="ad-item">Link profissional</div>
              <div class="ad-item">Histórico organizado</div>
              <div class="ad-item">Presença forte</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 💰 PLANOS -->
  <section class="lp-section lp-dark" id="lp-pricing">
    <div class="lp-inner">
      <div class="plans-grid">
        <!-- PLANO 1 -->
        <div class="plan-card lp-glass">
          <div class="plan-top" style="border-bottom:1px solid rgba(255,255,255,0.055)">
            <div class="plan-name" style="font-size:36px;font-family:var(--fd)">Starter</div>
            <div class="plan-price">R$ 99<small>,90</small></div>
          </div>
          <div class="plan-body" style="padding-top:20px;padding-bottom:30px">
            <div class="plan-feat">1 matéria</div>
            <div class="plan-feat">Painel</div>
            <div class="plan-feat">Página básica</div>
            <div class="plan-feat" style="color:#8888a0;margin-top:20px">Sem mídia kit</div>
            <div class="plan-feat" style="color:#8888a0">Sem cotas</div>
            <div class="plan-feat" style="color:#8888a0">Sem formulário</div>
          </div>
          <div class="plan-cta">
            <button class="btn btn-out btn-full" style="padding:16px;font-size:16px;border-color:rgba(255,255,255,0.2);color:#FFF" onclick="showView('login')">Começar básico</button>
          </div>
        </div>
        <!-- PLANO 2 -->
        <div class="plan-card lp-glass best" style="border:1px solid #f0a000">
          <div class="plan-best-tag" style="background:#f0a000;color:#04040a;font-weight:bold;font-family:var(--fm)">⭐</div>
          <div class="plan-top" style="border-bottom:1px solid rgba(240,160,0,0.2)">
            <p style="color:#f0a000;font-size:14px;margin-bottom:10px;font-family:var(--fb)">Tudo que você precisa pra se apresentar como piloto profissional de verdade</p>
            <div class="plan-name" style="font-size:36px;font-family:var(--fd)">Pro</div>
            <div class="plan-price">R$ 149<small>,90</small></div>
          </div>
          <div class="plan-body" style="padding-top:20px;padding-bottom:30px">
            <div class="plan-feat">2 matérias</div>
            <div class="plan-feat">Página completa</div>
            <div class="plan-feat">Mídia kit</div>
            <div class="plan-feat">Cotas</div>
            <div class="plan-feat">Formulário</div>
            <div class="plan-feat text-ouro">Destaque</div>
          </div>
          <div class="plan-cta">
            <button class="btn lp-btn-pri btn-full" style="padding:16px;font-size:16px" onclick="showView('login')">Quero parecer profissional</button>
          </div>
        </div>
      </div>
      
      <div style="text-align:center;margin-top:40px">
        <p style="font-family:var(--fm);font-size:14px;color:#8888a0;margin-bottom:10px">Matérias adicionais: R$59,90 <br> Equipes: A partir de R$499</p>
        <p style="font-family:var(--fb);font-size:14px;color:#00bb55">Sem contrato · Sem multa · Cancelar a qualquer momento</p>
      </div>

    </div>
  </section>

  <!-- ❓ FAQ -->
  <section class="lp-section">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:40px">FAQ</h2>
      <div class="lp-faq" style="max-width:800px;margin:0 auto">
        <details>
          <summary>Preciso escrever bem?</summary>
          <div class="faq-body">Não. O sistema recebe rascunhos.</div>
        </details>
        <details>
          <summary>Tempo?</summary>
          <div class="faq-body">Processos automatizados. Retorno no mesmo final de semana.</div>
        </details>
        <details>
          <summary>Cancelamento?</summary>
          <div class="faq-body">A qualquer hora via painel. O plano volta pro Free imediatamente.</div>
        </details>
        <details>
          <summary>Modalidades?</summary>
          <div class="faq-body">Qualquer modalidade profissional ou amadora chancelada.</div>
        </details>
        <details>
          <summary>Alterações IA?</summary>
          <div class="faq-body">A IA estrutura. Você pode aceitar ou mudar antes da postagem final.</div>
        </details>
        <details>
          <summary>Uso externo?</summary>
          <div class="faq-body">Os links são seus pra usar em patrocinadores offline e online.</div>
        </details>
        <details>
          <summary>Cancelamento mantém conteúdo?</summary>
          <div class="faq-body">Sim. O link gerado permanece ativo na nossa raiz eternamente.</div>
        </details>
        <details>
          <summary>Diferença planos?</summary>
          <div class="faq-body">O Pro te equipa com máquina de mídia kit corporativa. Focado em ROI rápido e patrocinador corporativo.</div>
        </details>
      </div>
    </div>
  </section>

  <!-- 🔥 CTA FINAL -->
  <section class="lp-section lp-dark" style="padding:100px 20px;border-top:1px solid rgba(255,255,255,0.055)">
    <div class="lp-inner" style="text-align:center;max-width:900px;margin:0 auto">
      <h2 class="lp-title" style="font-size:52px">Se você quer ser levado a sério fora da pista, precisa parecer profissional.</h2>
      <p style="font-size:24px;font-family:var(--fb);color:#8888a0;margin-bottom:40px">Você já investe na sua carreira.<br><span style="color:#f0f0f5">Agora organize como você se apresenta.</span></p>
      
      <div class="lp-btns" style="justify-content:center;margin-top:40px;flex-wrap:wrap">
        <button class="btn lp-btn-pri" style="font-size:22px;padding:22px 48px;border-radius:6px;width:auto;flex:1;min-width:300px" onclick="showView('login')">Criar meu perfil profissional</button>
        <button class="btn btn-out" style="font-size:22px;padding:22px 40px;border-color:rgba(255,255,255,0.2);color:#FFF;width:auto;flex:1;min-width:300px" onclick="toast('Encaminhando para WhatsApp','info'); window.open('https://wa.me/5511999999999?text=Quero%20criar%20meu%20perfil%20profissional%20no%20PitLane')">Falar no WhatsApp</button>
      </div>
    </div>
  </section>
</div><!-- /view-plans -->"""

with open('public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'(<div class="view" id="view-plans">)[\s\S]*?(</div><!-- \/view-plans -->)', html_content, text)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("HTML (Prompt Final) aplicado!")
