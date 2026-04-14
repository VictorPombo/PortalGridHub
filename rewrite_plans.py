import re

html_content = """<div class="view" id="view-plans">
  <!-- SEÇÃO 1: HERO -->
  <section class="lp-section no-border lp-hero">
    <div class="lp-inner">
      <div class="lp-badge-line"><span class="lp-badge pulse">● NOVA ERA DO JORNALISMO B2B</span><span class="lp-badge-text">Patrocinadores corporativos aguardam.</span></div>
      <h1 class="lp-title" style="font-size:72px">PARE DE IMPLORAR POR PATROCÍNIO.<br><span class="hl">SEJA ENCONTRADO POR ELES.</span></h1>
      <p class="lp-subtitle center">O algoritmo de aquisição mudou. Diretores ignoram PDFs genéricos enviados no inbox. Eles agora pesquisam na web e checam autoridade. Domine a <b>primeira aba corporativa do motor de busca</b> com notícias estruturadas.</p>
      <div class="lp-btns">
        <button class="btn btn-acc glow-acc" style="font-size:18px;padding:15px 36px" onclick="document.getElementById('lp-pricing').scrollIntoView({behavior:'smooth'})">Começar Minha Cobertura</button>
        <button class="btn btn-out" style="font-size:18px;padding:15px 36px;border-color:rgba(255,255,255,0.2);color:#FFF" onclick="showView('login')"><i class="fi fi-rr-rocket-lunch"></i> Acessar Sistema</button>
      </div>
      <div class="lp-trust-bar" style="margin-top:60px">
        <span class="lp-trust-label">Você listado ao lado do grid profissional do jornalismo:</span>
        <div class="lp-trust-logos">
          <span>ESPN</span><span>SKY SPORTS</span><span>MOTORSPORT.COM</span><span>GPFANS</span><span>AUTOSPORT</span>
        </div>
      </div>
    </div>
  </section>

  <!-- SEÇÃO 2: DOR / PROBLEMA -->
  <section class="lp-section bg-dark">
    <div class="lp-inner">
      <h2 class="lp-title center" style="font-size:42px">A INVISIBILIDADE COBRA CARO.</h2>
      <p class="lp-subtitle center" style="margin-bottom:60px;font-size:22px">Cruzar a linha de chegada em primeiro não atrai capital se fora do autódromo ninguém ouve sua história.</p>
      <div class="lp-grid-3 lp-pain-cards">
        <div class="lp-pain-card glass-card hover-glow">
          <div class="lp-pain-icon"><i class="fi fi-rr-sensor-alert" style="font-size:38px;color:#ff2a2a"></i></div>
          <h3>Buraco Negro B2B</h3>
          <p>Você manda dezenas de propostas robustas, a empresa procura sobre a sua estabilidade como parceiro na web e a checagem **retorna 0 notícias**. Conexão rompida.</p>
        </div>
        <div class="lp-pain-card glass-card hover-glow">
          <div class="lp-pain-icon"><i class="fi fi-rr-ghost" style="font-size:38px;color:#ff2a2a"></i></div>
          <h3>Amadorismo em Mídia</h3>
          <p>O diretor de marketing precisa de dados rígidos e indexação para colocar recursos. Seu perfil não entrega matéria ou SEO.</p>
        </div>
        <div class="lp-pain-card glass-card hover-glow">
          <div class="lp-pain-icon"><i class="fi fi-rr-money-bill-wave" style="font-size:38px;color:#ff2a2a"></i></div>
          <h3>Lucro Queimado</h3>
          <p>Você investe os fundos vitais pra acelerar, e esquece que a publicidade agressiva é que bancaria toda a próxima temporada sem tirar um real do seu bolso.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SEÇÃO 3: SOLUÇÃO -->
  <section class="lp-section">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:20px">A ESTRUTURA PARA ESCALA<br><span class="hl">DA SUA IMAGEM.</span></h2>
      <p class="lp-subtitle center">O ecossistema é otimizado para gerar autoridade imediata blindando sua carreira com presença online agressiva.</p>
      <div class="lp-grid-4">
        <div class="lp-card glass-card hover-glow">
          <i class="fi fi-rr-bullseye"></i>
          <h3>Visibilidade Laser</h3>
          <p>Publicações de elite e releases ranqueados organicamente que disparam com quem importa.</p>
        </div>
        <div class="lp-card glass-card hover-glow">
          <i class="fi fi-rr-rocket-lunch"></i>
          <h3>Fácil Manuseio</h3>
          <p>Um sistema simples no celular onde você bate relatórios de fim de semana de forma ágil que caem diretos no SaaS.</p>
        </div>
        <div class="lp-card glass-card hover-glow">
          <i class="fi fi-rr-badge-check"></i>
          <h3>Poder Midiático</h3>
          <p>Quando parceiros avaliarem, encontrarão sua biografia veiculada de maneira idêntica a dos gigantes da Fórmula 1.</p>
        </div>
        <div class="lp-card glass-card hover-glow">
          <i class="fi fi-rr-chart-histogram"></i>
          <h3>Plataforma Analítica</h3>
          <p>Monitore suas páginas rankeadas, capture leads corporativos diretamente da matéria, sem se perder em apps terceiros.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SEÇÃO 4: COMO FUNCIONA -->
  <section class="lp-section bg-dark">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:20px">OPERAÇÃO ÁGIL 100% EM WEB.</h2>
      <p class="lp-subtitle center">Sem burocracias. Um sistema projetado por trás dos corredores que roda nas nuvens.</p>
      
      <div class="lp-steps">
        <div class="lp-step">
          <div class="lp-step-num glass-num glow-red">1</div>
          <h3>Login Veloz</h3>
          <p style="font-size:16px">Entre na central segura da nossa plataforma, a partir do Autódromo nas pausas de Box via browser.</p>
        </div>
        <div class="lp-step">
          <div class="lp-step-num glass-num glow-red">2</div>
          <h3>Formulário Enxuto</h3>
          <p style="font-size:16px">Suba o log descritivo simples em segundos dentro do formulário e insira anexos dos fotógrafos.</p>
        </div>
        <div class="lp-step">
          <div class="lp-step-num glass-num glow-red">3</div>
          <h3>Engine Ativa</h3>
          <p style="font-size:16px">Em no máximo 48h a redação aprova, finaliza e crava a matéria nos domínios usando motores avançados de SEO.</p>
        </div>
        <div class="lp-step">
          <div class="lp-step-num glass-num glow-red">4</div>
          <h3>Leads Capturados</h3>
          <p style="font-size:16px">As empresas varrem as páginas, sentem firmeza irrefutável e o capital é direcionado a você e equipe via funil no mesmo painel.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SEÇÃO 5: PROVA SOCIAL -->
  <section class="lp-section">
    <div class="lp-inner">
      <div class="lp-stats glass-case" style="padding:40px;border-radius:12px;margin-bottom:80px">
        <div class="lp-stat"><div class="lp-stat-num glow-txt" data-target="18400" data-prefix="+">0</div><div class="lp-stat-lbl" style="color:#FFF">Visualizações Formadoras de Base</div></div>
        <div class="lp-stat"><div class="lp-stat-num glow-txt" data-target="148">0</div><div class="lp-stat-lbl" style="color:#FFF">Artigos Em Alta</div></div>
        <div class="lp-stat"><div class="lp-stat-num glow-txt" data-target="47">0</div><div class="lp-stat-lbl" style="color:#FFF">Pilotos com Presença Online</div></div>
        <div class="lp-stat"><div class="lp-stat-num glow-txt" data-target="86" data-suffix="%">0</div><div class="lp-stat-lbl" style="color:#FFF">Conversão Corporativa</div></div>
      </div>

      <div class="lp-case glass-case" style="border-radius:12px;overflow:hidden">
        <div class="lp-case-img" style="flex:0 0 35%;">
          <img src="https://images.unsplash.com/photo-1541348263662-e06836264b28?q=80&w=600&auto=format&fit=crop" alt="Case" style="width:100%;height:100%;object-fit:cover;filter:grayscale(0.6) contrast(1.2)">
        </div>
        <div class="lp-case-body" style="padding:50px">
            <div class="lp-case-mini-stats">
              <span style="background:rgba(232,0,45,0.15);border:1px solid rgba(232,0,45,0.3)"><strong>60 dias</strong> usando a Interface</span>
              <span style="background:rgba(232,0,45,0.15);border:1px solid rgba(232,0,45,0.3)"><strong>Contrato B2B</strong> Anual</span>
            </div>
            <div class="lp-quote" style="font-family:var(--fb);font-size:24px;font-style:normal;font-weight:300;line-height:1.4">"Eu mudei meu workflow. Ficar mendigando contrato copiando textos por aplicativo era humilhante. Gerei dados profissionais com essa engine web, botei o link nos e-mails formais. Recebi um orçamento de 20k porque mostrei organização da Formula 1 com custo base."</div>
            <div class="lp-author" style="margin-top:20px;font-family:var(--fu);font-size:16px;color:#FFF">RAFAEL MOURA <span style="font-weight:400;color:var(--dim)">| FÓRMULA 4 BRASIL</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- SEÇÃO 6: COMPETIÇÃO -->
  <section class="lp-section bg-dark">
    <div class="lp-inner">
      <h2 class="lp-title center" style="margin-bottom:60px">A ESTRUMEIRA ESTÁ REPLETA DE CARROS BONS.</h2>
      <div class="antes-depois">
        <div class="ad-col sem glass-card" style="border-right:none">
          <div class="ad-title" style="color:#ff4a4a;font-size:28px"><i class="fi fi-rr-cross-circle"></i> O Amador Invisível</div>
          <div class="ad-item"><i class="fi fi-rr-cross"></i> Acaba não sendo indexado por nenhum robô digital. </div>
          <div class="ad-item"><i class="fi fi-rr-cross"></i> Escreve PDFs no Canva que são abertos e fechados por desdém no celular.</div>
          <div class="ad-item"><i class="fi fi-rr-cross"></i> Histórico em perfis pessoais com algoritmo sabotado. Impossível convencer diretores que ele é valioso.</div>
          <div class="ad-item"><i class="fi fi-rr-cross"></i> Perde todo o orçamento sem nenhuma expansividade e escalabilidade de receita passiva.</div>
        </div>
        <div class="ad-col com glass-card" style="background:rgba(0,187,85,0.03);border-color:rgba(0,187,85,0.2)">
          <div class="ad-title" style="color:#00e676;font-size:28px"><i class="fi fi-rr-check-circle"></i> O Piloto GridHub Ultra</div>
          <div class="ad-item"><i class="fi fi-rr-check"></i> Usa o centralizador de interface para repassar todas as vitórias no instante que terminar as atividades do final de semana.</div>
          <div class="ad-item"><i class="fi fi-rr-check"></i> O resultado ecoa imediatamente na principal plataforma consolidada e explode a presença em busca aberta.</div>
          <div class="ad-item"><i class="fi fi-rr-check"></i> Capital B2B agressivo gerado não por suor comercial, e sim pela força invisível midiática de reportagens impecáveis e credíveis.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- SEÇÃO 7: PRICING -->
  <section class="lp-section" id="lp-pricing">
    <div class="lp-inner">
      <h2 class="lp-title center" style="font-size:54px;margin-bottom:20px">INICIE A EXPANSÃO SEM DÚVIDA</h2>
      <p class="lp-subtitle center">Estrutura puramente baseada na web, comece mapear suas presenças.</p>
      
      <div class="plans-grid">
        <!-- PLANO 1 -->
        <div class="plan-card glass-card hover-glow">
          <div class="plan-top" style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <div class="plan-tier">Sistema Base Virtual</div>
            <div class="plan-name">Onboarding</div>
            <div class="plan-price" style="color:#e0e0e0">R$ 0<small> para sempre.</small></div>
            <div class="plan-period">Setup e uso contínuo do ambiente.</div>
          </div>
          <div class="plan-body">
            <div class="plan-feat">Dash de Performance Limitado</div>
            <div class="plan-feat">Organização do Kit Básico</div>
            <div class="plan-feat no">Releases Editados</div>
            <div class="plan-feat no">Jornalismo Indexado</div>
            <div class="plan-feat no">Cobertura do Portal News</div>
          </div>
          <div class="plan-cta">
            <button class="btn btn-out btn-full" style="padding:16px;font-size:14px;border-color:rgba(255,255,255,0.15);color:#FFF" onclick="showView('login')">Acessar Free</button>
          </div>
        </div>
        <!-- PLANO 2 -->
        <div class="plan-card glass-card best" style="border-color:#ff2a2a;background:linear-gradient(180deg, rgba(232,0,45,0.05) 0%, rgba(0,0,0,0.5) 100%);box-shadow:0 0 50px rgba(232,0,45,0.12)">
          <div class="plan-best-tag" style="background:#ff2a2a;letter-spacing:4px">ACESSO PREMIUM PRO</div>
          <div class="plan-top" style="border-bottom:1px solid rgba(232,0,45,0.2)">
            <div class="plan-tier" style="color:#ff2a2a">Exposição Institucional Acelerada</div>
            <div class="plan-name">Atleta Ouro</div>
            <div class="plan-price">R$ 349<small>,90/mês</small></div>
            <div class="plan-period">Preço equivalente a 1 jogo de pneus. Se paga.</div>
          </div>
          <div class="plan-body">
            <div class="plan-feat">Tudo do Dashboard Completo</div>
            <div class="plan-feat">2 Materiais Customizados p/ Mês</div>
            <div class="plan-feat">Motor de Distribuição SEO Google B2B</div>
            <div class="plan-feat">Tratamento Audiovisual Jornalístico</div>
            <div class="plan-feat">Perfil Piloto Premium com Monitoramento de Lead</div>
          </div>
          <div class="plan-cta">
            <button class="btn btn-acc btn-full glow-acc" style="padding:16px;font-size:16px" onclick="showView('login')">Configurar o Piloto</button>
          </div>
        </div>
      </div>
      
      <div class="lp-guarantee glass-case" style="border-left:4px solid #00bb55;border-radius:12px;margin-top:50px">
        <i class="fi fi-rr-shield-check" style="font-size:38px;color:#00bb55;flex-shrink:0"></i>
        <div>
          <strong style="font-family:var(--fd);font-size:20px;color:#FFF;display:block;margin-bottom:6px">Segurança Total On-Premise Cloud</strong>
          <p style="color:#c0c0c0;font-size:15px;line-height:1.6;margin:0;font-family:var(--fb)">Basta dar os cliques. Sem vínculos arcaicos ou assinaturas forçadas. Toda interação desde a aprovação comercial é feita dentro do seu gateway isolado no sistema, gerando eficiência assombrosa.</p>
        </div>
      </div>

    </div>
  </section>

  <!-- SEÇÃO 8: CTA FINAL -->
  <section class="lp-section hp-cta-block">
    <div class="lp-inner" style="text-align:center;max-width:800px;margin:0 auto">
      <h2 class="lp-title" style="font-size:62px;text-shadow:0 0 20px rgba(0,0,0,0.5)">NÚMEROS BEM FRIOS:</h2>
      <p style="font-size:24px;font-family:var(--fb);color:#CCC;margin-bottom:40px">Se você não der o play da engrenagem orgânica agora, seu legado em vitórias continuará isolado de diretores.</p>
      <div class="lp-btns" style="justify-content:center;margin-top:30px">
        <button class="btn btn-acc glow-acc" style="font-size:22px;padding:22px 64px;border-radius:6px" onclick="showView('login')"><i class="fi fi-rr-arrow-right-to-bracket"></i> Acelerar Sistema</button>
      </div>
      <p style="margin-top:24px;font-family:var(--fm);font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase">Operacional 100% Nativo · Online Seguro</p>
    </div>
  </section>
</div><!-- /view-plans -->"""

with open('public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Substituir o #view-plans
text = re.sub(r'(<div class="view" id="view-plans">)[\s\S]*?(</div><!-- \/view-plans -->)', html_content, text)

# Remover o botão flutuante de whatsapp, tem esse bloco <a ... class="whatsapp-float" ... </a>
text = re.sub(r'<a[^>]*class="whatsapp-float"[^>]*>[\s\S]*?</a>\n?', '', text)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("HTML reescrito com sucesso (SaaS agressivo + 0 WhatsApp).")
