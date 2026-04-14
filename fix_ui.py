import re

html_content = """<div class="view" id="view-plans">
  <!-- 🏁 HERO -->
  <section class="lp-section no-border lp-hero" style="padding-top:120px;padding-bottom:100px;">
    <div class="lp-inner text-center">
      <h1 class="lp-title" style="font-size:82px;line-height:1.1;margin-bottom:20px;text-transform:uppercase;letter-spacing:-1px;">Pare de parecer amador fora da pista.</h1>
      
      <p class="lp-subtitle center" style="margin-bottom:40px;font-size:24px;max-width:800px;margin-left:auto;margin-right:auto;">Você investe na sua carreira como piloto.<br>Mas ainda se apresenta com prints, PDFs perdidos e stories que somem em 24h.</p>
      
      <p class="lp-subtitle center" style="margin-bottom:60px;font-size:20px;color:var(--dim);max-width:900px;margin-left:auto;margin-right:auto;font-weight:400">O PitLane transforma suas atualizações em uma presença profissional — com matérias, página própria e um link pronto pra enviar pra qualquer patrocinador.</p>
      
      <div class="lp-btns flex-center" style="gap:20px;margin-bottom:80px">
        <button class="btn btn-acc glow-acc" style="font-size:20px;padding:20px 48px;font-family:var(--fd);letter-spacing:1px;border-radius:8px" onclick="showView('login')">CRIAR MEU PERFIL PROFISSIONAL</button>
        <button class="btn btn-out" style="font-size:20px;padding:20px 48px;border-color:rgba(255,255,255,0.2);color:#FFF;border-radius:8px;font-family:var(--fd);letter-spacing:1px" onclick="toast('Encaminhando para o WhatsApp','info'); window.open('https://wa.me/5511999999999?text=Quero%20criar%20meu%20perfil%20profissional%20no%20PitLane')"><i class="fi fi-brands-whatsapp" style="margin-right:8px;color:#00bb55"></i> Falar no WhatsApp</button>
      </div>
      
      <div class="lp-trust-bar" style="opacity:0.3;border-top:1px solid rgba(255,255,255,0.1);padding-top:40px">
        <div class="lp-trust-logos flex-center" style="gap:40px;flex-wrap:wrap;font-family:var(--fd);font-size:24px;letter-spacing:2px">
          <span>ESPN</span><span style="opacity:0.2;font-size:14px">●</span><span>SKY SPORTS</span><span style="opacity:0.2;font-size:14px">●</span><span>MOTORSPORT.COM</span><span style="opacity:0.2;font-size:14px">●</span><span>GPFANS</span><span style="opacity:0.2;font-size:14px">●</span><span>AUTOSPORT</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ⚠️ PROBLEMA -->
  <section class="lp-section lp-dark" style="padding:100px 0;background:linear-gradient(180deg, #04040a 0%, #0a0a0f 100%)">
    <div class="lp-inner">
      <div class="lp-grid-2" style="gap:40px;margin-bottom:60px">
        <div class="lp-pain-card lp-glass flex-row">
          <div class="lp-icon-circle bg-red-dim"><i class="fi fi-rr-comment-x"></i></div>
          <div class="lp-pain-txt">Você manda mensagem pra patrocinador e <b>fica no vácuo</b></div>
        </div>
        <div class="lp-pain-card lp-glass flex-row">
          <div class="lp-icon-circle bg-red-dim"><i class="fi fi-rr-file-pdf"></i></div>
          <div class="lp-pain-txt">Seu mídia kit é um <b>PDF perdido</b> no WhatsApp</div>
        </div>
        <div class="lp-pain-card lp-glass flex-row">
          <div class="lp-icon-circle bg-red-dim"><i class="fi fi-rr-history"></i></div>
          <div class="lp-pain-txt">Seus resultados <b>somem em 24h</b> no Instagram</div>
        </div>
        <div class="lp-pain-card lp-glass flex-row">
          <div class="lp-icon-circle bg-red-dim"><i class="fi fi-rr-money-bill-wave"></i></div>
          <div class="lp-pain-txt">Você investe na pista, mas <b>não na sua apresentação</b></div>
        </div>
      </div>
      
      <div class="center-text" style="background:rgba(232,0,45,0.05);border:1px solid rgba(232,0,45,0.2);padding:40px;border-radius:12px;max-width:800px;margin:0 auto">
        <h3 style="font-size:36px;color:#f0f0f5;font-weight:bold;font-family:var(--fd);margin:0">👉 VOCÊ CORRE COMO PROFISSIONAL.</h3>
        <h3 style="font-size:36px;color:#8888a0;font-weight:bold;font-family:var(--fd);margin:0">MAS SE APRESENTA COMO AMADOR.</h3>
      </div>
    </div>
  </section>

  <!-- 🚀 SOLUÇÃO -->
  <section class="lp-section" style="padding:120px 0">
    <div class="lp-inner">
      <h2 class="lp-title center" style="font-size:48px;margin-bottom:60px">O HUB DA SUA AUTORIDADE</h2>
      <div class="lp-grid-4">
        <div class="lp-card lp-glass sol-card">
          <div class="sol-icon"><i class="fi fi-rr-document"></i></div>
          <h3>Matérias profissionais</h3>
          <p>Conteúdo com padrão jornalístico gerado por IA publicando suas conquistas da pista.</p>
        </div>
        <div class="lp-card lp-glass sol-card">
          <div class="sol-icon"><i class="fi fi-rr-user"></i></div>
          <h3>Página do piloto</h3>
          <p>Perfil estruturado profissionalmente centralizando toda a sua carreira esportiva em um link.</p>
        </div>
        <div class="lp-card lp-glass sol-card">
          <div class="sol-icon"><i class="fi fi-rr-bullseye"></i></div>
          <h3>Mídia kit automático</h3>
          <p>Seus dados de carreira convertidos em apresentações PDF corporativas de marca na hora.</p>
        </div>
        <div class="lp-card lp-glass sol-card">
          <div class="sol-icon"><i class="fi fi-rr-dashboard"></i></div>
          <h3>Painel de controle</h3>
          <p>Dashboard pessoal prático online pra gerenciar matérias, estatísticas e contatos.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ⚙️ COMO FUNCIONA -->
  <section class="lp-section lp-dark" style="padding:120px 0">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:60px;font-size:48px">MÁQUINA EM 5 PASSOS</h2>
      <div class="lp-steps flex-layout steps-timeline">
        <div class="lp-step-box">
          <div class="lp-num">1</div>
          <h3>Você acessa seu painel</h3>
          <p>Login no dashboard exclusivo</p>
        </div>
        <div class="lp-step-box">
          <div class="lp-num">2</div>
          <h3>Envia o conteúdo</h3>
          <p>Até 3 fotos e um áudio cru do que rolou na corrida</p>
        </div>
        <div class="lp-step-box ai-focus">
          <div class="lp-num glow-red" style="transform:scale(1.2)">3</div>
          <h3 style="color:#FFF">A IA transforma em matéria</h3>
          <p>Em poucos minutos, tudo transcrito em texto jornalístico profissional</p>
        </div>
        <div class="lp-step-box">
          <div class="lp-num">4</div>
          <h3>Você aprova e publica</h3>
          <p>Revisa no painel. Aprovou? Vai ao ar na hora.</p>
        </div>
        <div class="lp-step-box">
          <div class="lp-num">5</div>
          <h3>Seu link fica mais forte</h3>
          <p>A matéria enriquece sua página pra atrair novos negócios</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 🧪 DEMONSTRAÇÃO -->
  <section class="lp-section" style="padding:120px 0;background:url('https://images.unsplash.com/photo-1541348263662-e06836264b28?q=80&w=1920&auto=format&fit=crop') center/cover no-repeat;position:relative">
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(180deg, rgba(4,4,10,1) 0%, rgba(4,4,10,0.85) 50%, rgba(4,4,10,1) 100%);"></div>
    <div class="lp-inner" style="position:relative;z-index:2">
      <h2 class="lp-title center" style="margin-bottom:20px;font-size:54px;text-shadow:0 4px 20px rgba(0,0,0,0.8)">O SISTEMA EM AÇÃO</h2>
      <p class="lp-subtitle center" style="margin-bottom:80px">Não é promessa, é ferramenta ativa pronta pro uso real.</p>
      
      <div class="lp-grid-3 demo-cards">
        <!-- DEMO 1: Painel -->
        <div class="lp-card demo-card dark-mockup">
          <div class="demo-badge"><i class="fi fi-rr-eye"></i> EXEMPLO: PAINEL DO PILOTO</div>
          <div class="demo-content">
            <div class="mock-pnl-header gap-10">
               <div class="mock-avatar"></div>
               <div>
                 <div style="font-family:var(--fd);font-size:22px;color:#FFF">Lucas Ferreira</div>
                 <div style="color:var(--dim);font-size:13px">Piloto F4 Brasil</div>
               </div>
            </div>
            <div class="flex-layout gap-10 mt-20">
               <div class="mock-stat-box"><b class="color-gold">3</b><br><span>Matérias</span></div>
               <div class="mock-stat-box"><b class="color-gold">1.240</b><br><span>Visuais</span></div>
               <div class="mock-stat-box"><b class="color-gold">2</b><br><span>Contatos</span></div>
            </div>
            <div class="mt-20">
               <div class="mock-list-item">Etapa Interlagos <span class="badge-success">Publicada</span></div>
               <div class="mock-list-item">Pole Velocitta <span class="badge-warning">Em Revisão</span></div>
            </div>
          </div>
        </div>

        <!-- DEMO 2: Matéria -->
        <div class="lp-card demo-card dark-mockup">
          <div class="demo-badge"><i class="fi fi-rr-eye"></i> EXEMPLO: MATÉRIA PUBLICADA</div>
          <div class="demo-content">
            <div class="mock-mat-header">
               <span style="color:#e8002d;font-family:var(--fd);font-size:14px;letter-spacing:1px">PITLANE NEWS</span>
               <h4 style="font-family:var(--fd);font-size:28px;color:#FFF;line-height:1.1;margin-top:5px;text-transform:none">Lucas Ferreira Conquista Pódio na 3ª Etapa da F4 em Goiânia</h4>
            </div>
            <div class="mock-mat-txt mt-15" style="line-height:1.6">
               "O piloto paulista de 21 anos largou em 4º e escalou o grid até o 2º lugar com uma estratégia agressiva de ultrapassagens nas primeiras voltas da disputa do último domingo..."
            </div>
            <div class="mock-mat-tags mt-15">
               <span>F4 Brasil</span> <span>Resultado</span> <span>2026</span>
            </div>
            <div class="mock-mat-footer mt-15" style="font-size:12px;color:var(--dim)">Redação PitLane · 3 min de leitura</div>
          </div>
        </div>

        <!-- DEMO 3: Página -->
        <div class="lp-card demo-card dark-mockup">
          <div class="demo-badge"><i class="fi fi-rr-eye"></i> EXEMPLO: PÁGINA DO PILOTO</div>
          <div class="demo-content text-center">
            <div class="mock-pg-photo mx-auto" style="width:80px;height:80px;margin:0 auto"></div>
            <h4 style="font-family:var(--fd);font-size:26px;color:#FFF;margin-top:10px">Lucas Ferreira</h4>
            <div class="mock-mat-txt" style="margin-top:5px">Evoluindo desde o Kart rumo ao auge dos monopostos.</div>
            <div class="flex-center gap-10 mt-15" style="justify-content:center">
               <span style="background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;font-size:12px"><b>5</b> Vitórias</span>
               <span style="background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;font-size:12px"><b>12</b> Pódios</span>
            </div>
            <div class="mock-pg-cotas mt-20">💰 Cotas Master/Ouro Abertas</div>
            <div class="btn btn-acc btn-full mt-10" style="padding:10px;font-size:14px">Enviar Proposta de Patrocínio</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 🏎️ PARA QUEM É -->
  <section class="lp-section lp-dark" style="padding:100px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
    <div class="lp-inner center">
        <h2 class="lp-title" style="font-size:42px;margin-bottom:20px">🏎️ PARA QUEM É</h2>
        <div class="tags-cloud flex-center" style="flex-wrap:wrap;gap:15px;max-width:1000px;margin:0 auto 40px">
           <span class="nice-pill">F4 Brasil</span>
           <span class="nice-pill">Stock Car</span>
           <span class="nice-pill">Copa HB20</span>
           <span class="nice-pill">Kart Profissional</span>
           <span class="nice-pill">MotoGP</span>
           <span class="nice-pill">Endurance / WEC</span>
           <span class="nice-pill">Rally</span>
           <span class="nice-pill">Truck</span>
           <span class="nice-pill">Turismo Nacional</span>
           <span class="nice-pill">Fórmula Regional</span>
           <span class="nice-pill">Sim Racing</span>
           <span class="nice-pill">Arrancada</span>
           <span class="nice-pill">NASCAR Brasil</span>
           <span class="nice-pill">Sprint Race</span>
           <span class="nice-pill hl-acc glow-border">+ Qualquer modalidade</span>
        </div>
        <p style="font-size:24px;font-family:var(--fb);color:var(--dim);border-top:1px solid rgba(255,255,255,0.1);padding-top:40px;max-width:600px;margin:0 auto">Do kart ao asfalto. Do simulador à pista.<br><b style="color:#FFF">Se você compete, o PitLane é pra você.</b></p>
    </div>
  </section>

  <!-- ⚡ DIFERENCIAL & 🔄 ANTES vs DEPOIS -->
  <section class="lp-section" style="padding:100px 0">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:60px;font-size:48px">O SEU PERFIL CORPORATIVO</h2>
      <div class="lp-grid-4 margin-bottom-80">
         <div class="lp-card lp-glass">
            <h4 style="font-size:20px;color:#f0f0f5;margin-bottom:10px">Não dependemos de algoritmo</h4>
            <p style="color:var(--dim);font-size:15px;line-height:1.5">Seu conteúdo não some em 24h como nos Stories. Cada matéria é indexada e permanente no portal.</p>
         </div>
         <div class="lp-card lp-glass">
            <h4 style="font-size:20px;color:#f0f0f5;margin-bottom:10px">Você tem controle total</h4>
            <p style="color:var(--dim);font-size:15px;line-height:1.5">Nada é publicado sem sua aprovação. Você decide o que sai e o que não sai na sua bio corporativa.</p>
         </div>
         <div class="lp-card lp-glass">
            <h4 style="font-size:20px;color:#f0f0f5;margin-bottom:10px">Seu link é seu ativo</h4>
            <p style="color:var(--dim);font-size:15px;line-height:1.5">Use a URL como cartão de visita. Mande pra patrocinadores, assessores e equipes oficiais.</p>
         </div>
         <div class="lp-card lp-glass">
            <h4 style="font-size:20px;color:#f0f0f5;margin-bottom:10px">Ferramenta de posicionamento</h4>
            <p style="color:var(--dim);font-size:15px;line-height:1.5">Não é rede social. É uma plataforma que organiza e blinda a sua presença real no automobilismo.</p>
         </div>
      </div>

      <div class="ad-cards compare-table">
        <div class="ad-col sem bg-soft-red">
          <div class="ad-title color-red"><i class="fi fi-rr-cross-circle"></i> SEM O PITLANE</div>
          <div class="ad-item"><i class="fi fi-rr-cross color-red"></i> <span>Você manda PDF genérico pelo WhatsApp e ninguém abre.</span></div>
          <div class="ad-item"><i class="fi fi-rr-cross color-red"></i> <span>Seus resultados somem depois de 24h nos Stories.</span></div>
          <div class="ad-item"><i class="fi fi-rr-cross color-red"></i> <span>Nenhum material profissional pra apresentar a um patrocinador.</span></div>
          <div class="ad-item"><i class="fi fi-rr-cross color-red"></i> <span>Gasta R$5.000 correndo e R$0 em apresentação profissional.</span></div>
        </div>
        <div class="ad-col com bg-soft-green">
          <div class="ad-title color-green"><i class="fi fi-rr-check-circle"></i> COM O PITLANE</div>
          <div class="ad-item"><i class="fi fi-rr-check color-green"></i> <span>Link profissional estruturado pronto pra enviar a qualquer hora.</span></div>
          <div class="ad-item"><i class="fi fi-rr-check color-green"></i> <span>Cada vitória vira matéria e acervo jornalístico permanente.</span></div>
          <div class="ad-item"><i class="fi fi-rr-check color-green"></i> <span>Mídia kit perfeitamente atualizado e cotas organizadas.</span></div>
          <div class="ad-item"><i class="fi fi-rr-check color-green"></i> <span>Por pouco por mês, presença corporativa que sustenta a sua carreira inteira.</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- 💰 PLANOS -->
  <section class="lp-section lp-dark" id="lp-pricing" style="padding:120px 0">
    <div class="lp-inner">
      
      <div class="plans-grid">
        <!-- PLANO 1 -->
        <div class="plan-card lp-glass">
          <div class="plan-top" style="border-bottom:1px solid rgba(255,255,255,0.055)">
            <div class="plan-name" style="font-size:36px;font-family:var(--fd)">Piloto Starter</div>
            <div class="plan-price">R$ 99<small>,90/mês</small></div>
            <div style="color:var(--dim);font-size:14px;margin-top:5px">Menos de R$3,50 por dia</div>
          </div>
          <div class="plan-body" style="padding-top:20px;padding-bottom:30px">
            <div class="plan-feat"><i class="fi fi-rr-check color-green"></i> 1 matéria por mês (IA + revisão)</div>
            <div class="plan-feat"><i class="fi fi-rr-check color-green"></i> Painel do piloto</div>
            <div class="plan-feat"><i class="fi fi-rr-check color-green"></i> Página básica no portal</div>
            <div class="plan-feat"><i class="fi fi-rr-check color-green"></i> Selo CONAR de Transparência</div>
            <div class="plan-feat no"><del>Mídia Kit PDF automático</del></div>
            <div class="plan-feat no"><del>Cotas de Patrocínio</del></div>
            <div class="plan-feat no"><del>Formulário p/ patrocinadores</del></div>
            <div class="plan-feat no"><del>Destaque na home</del></div>
          </div>
          <div class="plan-cta">
            <button class="btn btn-out btn-full" style="padding:16px;font-size:18px;border-color:rgba(255,255,255,0.2);color:#FFF;font-family:var(--fd);letter-spacing:1px" onclick="showView('login')">COMEÇAR AGORA</button>
          </div>
        </div>

        <!-- PLANO 2 -->
        <div class="plan-card lp-glass best" style="border:2px solid #e8002d;transform:scale(1.05);z-index:2;background:linear-gradient(180deg, rgba(232,0,45,0.08) 0%, rgba(4,4,10,0.8) 100%)">
          <div class="plan-best-tag" style="background:#e8002d;color:#FFF;font-weight:bold;font-family:var(--fb);font-size:14px;letter-spacing:2px;padding:8px">⭐ MAIS POPULAR</div>
          <div class="plan-top" style="border-bottom:1px solid rgba(232,0,45,0.2)">
            <div class="plan-name" style="font-size:36px;font-family:var(--fd)">Piloto Pro</div>
            <div class="plan-price" style="color:#FFF">R$ 149<small>,90/mês</small></div>
            <div style="color:var(--dim);font-size:14px;margin-top:5px">O preço de 1 café por dia</div>
          </div>
          <div class="plan-body" style="padding-top:20px;padding-bottom:30px">
            <div class="plan-feat"><i class="fi fi-rr-check color-green"></i> 2 matérias por mês (IA + revisão)</div>
            <div class="plan-feat"><i class="fi fi-rr-check color-green"></i> Painel do piloto</div>
            <div class="plan-feat font-bold" style="color:#FFF"><i class="fi fi-rr-check color-green"></i> Página profissional completa</div>
            <div class="plan-feat font-bold" style="color:#FFF"><i class="fi fi-rr-check color-green"></i> Mídia Kit PDF automático</div>
            <div class="plan-feat font-bold" style="color:#FFF"><i class="fi fi-rr-check color-green"></i> Cotas organizadas na página</div>
            <div class="plan-feat font-bold" style="color:#FFF"><i class="fi fi-rr-check color-green"></i> Formulário de contato de marca</div>
            <div class="plan-feat font-bold" style="color:#FFF"><i class="fi fi-rr-check color-green"></i> Destaque na home 1x/mês</div>
          </div>
          <div class="plan-cta">
            <button class="btn btn-acc btn-full glow-acc" style="padding:20px;font-size:20px;font-family:var(--fd);letter-spacing:1px" onclick="showView('login')">QUERO O PRO</button>
          </div>
        </div>

        <!-- PLANO 3 AVULSA BANNERS LATER -->
      </div>
      
      <!-- BANNERS -->
      <div style="max-width:900px;margin:60px auto 0;text-align:center">
        <div class="lp-glass" style="padding:20px;border-radius:8px;margin-bottom:20px;font-size:18px">
           <i class="fi fi-rr-shopping-cart-add" style="color:#f0a000;margin-right:10px"></i>
           Precisa de mais matérias? Compre avulsas por <b>R$59,90 cada</b>, sem precisar mudar de plano.
        </div>
        <div class="lp-glass" style="padding:30px;border-radius:8px;border-color:rgba(255,255,255,0.1)">
           <h3 style="font-family:var(--fd);font-size:28px">REPRESENTA UMA EQUIPE OU CATEGORIA?</h3>
           <p style="color:var(--dim);font-size:16px;margin-bottom:20px">Temos planos em volume, landing page dedicada e cobertura completa.<br>Equipe a partir de R$ 499/mês • Categoria a partir de R$ 999/mês.</p>
           <button class="btn btn-out" style="border-color:#FFF;color:#FFF" onclick="toast('Encaminhando Cotação Equipe','info')">Solicitar Proposta</button>
        </div>
      </div>

      <!-- BADGE GARANTIA -->
      <div class="flex-center mt-40 gap-10" style="max-width:600px;margin:40px auto 0;background:rgba(0,187,85,0.05);border:1px solid rgba(0,187,85,0.2);padding:20px;border-radius:8px">
        <i class="fi fi-rr-shield-check" style="font-size:38px;color:#00bb55"></i>
        <div style="text-align:left">
          <strong style="color:#00bb55;font-size:18px">Risco Zero</strong>
          <p style="color:var(--dim);font-size:14px;margin:0">Sem contrato. Sem taxa de adesão. Sem multa. Cancele pelo painel quando quiser, sem precisar ligar pra ninguém.</p>
        </div>
      </div>

    </div>
  </section>

  <!-- ❓ FAQ -->
  <section class="lp-section" style="padding:100px 0">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:60px;font-size:48px">FAQ</h2>
      <div class="lp-faq" style="max-width:800px;margin:0 auto">
        <details>
          <summary>Preciso escrever bem pra usar?</summary>
          <div class="faq-body">De jeito nenhum. Você é piloto, não jornalista. Manda fotos e uma descrição simples do que aconteceu. Pode ser texto cru ou áudio. A IA transforma em matéria profissional.</div>
        </details>
        <details>
          <summary>Em quanto tempo a matéria fica pronta?</summary>
          <div class="faq-body">Poucos minutos. A IA gera o texto na hora. Você revisa, aprova e publica.</div>
        </details>
        <details>
          <summary>Posso cancelar quando quiser?</summary>
          <div class="faq-body">Sim. Sem multa, sem burocracia. Cancela pelo painel com um clique.</div>
        </details>
        <details>
          <summary>Funciona pra qualquer modalidade?</summary>
          <div class="faq-body">Sim. F4, Stock Car, Kart, MotoGP, Rally, Truck, Sim Racing, Arrancada — qualquer categoria do automobilismo.</div>
        </details>
        <details>
          <summary>E se eu não gostar do texto que a IA gerou?</summary>
          <div class="faq-body">Você pede alteração direto no painel. A IA reescreve quantas vezes precisar até você aprovar.</div>
        </details>
        <details>
          <summary>Posso usar as matérias no meu mídia kit pessoal?</summary>
          <div class="faq-body">Sim. As matérias são sobre você e ficam públicas. Compartilhe o link com quem quiser.</div>
        </details>
        <details>
          <summary>O que acontece se eu cancelar?</summary>
          <div class="faq-body">Sua página e matérias continuam visíveis no portal. Você só não poderá publicar novas matérias.</div>
        </details>
        <details>
          <summary>Qual a diferença entre Starter e Pro?</summary>
          <div class="faq-body">O Starter dá acesso ao painel e 1 matéria por mês. O Pro inclui tudo do Starter + página profissional completa, mídia kit, cotas de patrocínio, formulário de contato e destaque na home. O Pro é feito pra quem quer atrair patrocinadores de verdade.</div>
        </details>
      </div>
    </div>
  </section>

  <!-- 🔥 CTA FINAL -->
  <section class="lp-section lp-dark" style="padding:140px 20px;border-top:1px solid rgba(255,255,255,0.055)">
    <div class="lp-inner" style="text-align:center;max-width:900px;margin:0 auto">
      <h2 class="lp-title" style="font-size:62px;line-height:1.1;letter-spacing:-1px">Se você quer ser levado a sério fora da pista,<br>precisa parecer profissional.</h2>
      <p style="font-size:24px;font-family:var(--fb);color:var(--dim);margin-top:20px;margin-bottom:60px">Você já investe na sua carreira.<br><span style="color:#f0f0f5">Agora organize como você se apresenta.</span></p>
      
      <div class="lp-btns flex-center" style="gap:20px;flex-wrap:wrap">
        <button class="btn btn-acc glow-acc" style="font-size:22px;padding:22px 48px;border-radius:8px;font-family:var(--fd);letter-spacing:1px" onclick="showView('login')">QUERO COMEÇAR AGORA</button>
        <button class="btn btn-out" style="font-size:22px;padding:22px 40px;border-color:rgba(255,255,255,0.2);color:#FFF;border-radius:8px;font-family:var(--fd);letter-spacing:1px" onclick="toast('Encaminhando para WhatsApp','info'); window.open('https://wa.me/5511999999999?text=Quero%20criar%20meu%20perfil%20profissional%20no%20PitLane')"><i class="fi fi-brands-whatsapp" style="margin-right:8px;color:#00bb55"></i> Falar no WhatsApp</button>
      </div>
    </div>
  </section>
</div><!-- /view-plans -->
<!-- BOTAO FLUTUANTE WPP -->
<a href="https://wa.me/5511999999999?text=Tenho%20dúvidas%20sobre%20os%20planos%20PitLane" class="whatsapp-float bg-success scale-hover" target="_blank" title="Fale conosco no WhatsApp">
  <i class="fi fi-brands-whatsapp" style="font-size:32px;color:#FFF;line-height:60px;display:block;text-align:center"></i>
</a>"""

with open('public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace block
text = re.sub(r'(<div class="view" id="view-plans">)[\s\S]*?(</div><!-- \/view-plans -->)', html_content, text)

# Add whatsapp float right after view-plans if it doesn't exist
if 'class="whatsapp-float"' not in text:
    text = text.replace('</div><!-- /view-plans -->', '</div><!-- /view-plans -->\n<!-- BOTAO FLUTUANTE WPP -->\n<a href="https://wa.me/5511999999999" class="whatsapp-float" style="position:fixed;bottom:30px;right:30px;background:#25D366;width:60px;height:60px;border-radius:50%;box-shadow:0 6px 20px rgba(37,211,102,0.4);z-index:9999;transition:0.3s" target="_blank">\n  <i class="fi fi-brands-whatsapp" style="font-size:32px;color:#FFF;line-height:60px;display:block;text-align:center"></i>\n</a>')

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("HTML reescrito focado no css estrutural perfeito!")
