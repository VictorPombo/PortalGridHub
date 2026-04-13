import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ==========================================
# REPLACEMENT 1: NEWS CARDS
# ==========================================
import sys

# We need to extract Card 1, Card 2, and Card 7 (Patrocinado)
# Card 1: from `<!-- CARD INTERNO -->` with `data-id="0"` to the end of its div.
c1_match = re.search(r'(<!-- CARD INTERNO -->\s*<div class="ncard feat is-int" data-cat="f1" data-type="int" data-id="0"[\s\S]*?<div class="ncard-dest int">.*?</div>\s*</div>)', html)
c2_match = re.search(r'(<!-- CARD EXTERNO -->\s*<div class="ncard is-ext" data-cat="f1" data-type="ext" onclick="extLink\(\'https://www\.skysports\.com/f1\'\)"[\s\S]*?<div class="ncard-dest ext">.*?</div>\s*</div>)', html)
c7_match = re.search(r'(<!-- CARD PATROCINADO Rafael Moura -->\s*<div class="ncard is-pago" data-cat="f1" data-type="pago" data-id="5"[\s\S]*?<div class="ncard-dest int">.*?</div>\s*</div>)', html)

c3_new = """      <!-- CARD EXTERNO MOTOGP -->
      <div class="ncard is-ext" data-cat="motogp" data-type="ext" onclick="extLink('https://www.motogp.com')">
        <div class="ncard-thumb">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/58/Marc_M%C3%A1rquez_2019_Brno.jpg" alt="">
          <div class="ncard-ribbon"><span class="badge b-motogp">MOTOGP · 2026</span></div>
        </div>
        <div class="ncard-body">
          <div class="ncard-type-row">
            <span class="tag-ext"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg> MotoGP.com</span>
          </div>
          <div class="ncard-title">Marc Márquez Lidera Classificação Após Vitória Dominante em Le Mans</div>
          <div class="ncard-excerpt">Piloto espanhol conquista sua terceira vitória consecutiva na temporada e abre vantagem no campeonato de pilotos.</div>
          <div class="ncard-footer">
            <span class="ncard-meta">10 ABR · MOTOGP.COM</span>
            <span style="font-family:var(--fm);font-size:9px;color:var(--blue)">↗ sai do site</span>
          </div>
        </div>
        <div class="ncard-dest ext"><i class="fi fi-rr-link"></i> Abre MotoGP.com em nova aba</div>
      </div>"""

c4_new = """      <!-- CARD EXTERNO WEC -->
      <div class="ncard is-ext" data-cat="wec" data-type="ext" onclick="extLink('https://www.fiawec.com')">
        <div class="ncard-thumb">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/50/Circuit_Francorchamps_Eau_Rouge.jpg" alt="">
          <div class="ncard-ribbon"><span class="badge b-wec">WEC · LE MANS</span></div>
        </div>
        <div class="ncard-body">
          <div class="ncard-type-row">
            <span class="tag-ext"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg> FIA WEC</span>
          </div>
          <div class="ncard-title">Toyota Confirma Novo Pacote Aerodinâmico para as 24 Horas de Le Mans</div>
          <div class="ncard-excerpt">Equipe japonesa aposta em evolução do GR010 Hybrid para buscar vitória na prova mais importante do calendário de endurance.</div>
          <div class="ncard-footer">
            <span class="ncard-meta">9 ABR · FIA WEC</span>
            <span style="font-family:var(--fm);font-size:9px;color:var(--blue)">↗ sai do site</span>
          </div>
        </div>
        <div class="ncard-dest ext"><i class="fi fi-rr-link"></i> Abre FIA WEC em nova aba</div>
      </div>"""

c5_new = """      <!-- CARD EXTERNO NASCAR -->
      <div class="ncard is-ext" data-cat="nascar" data-type="ext" onclick="extLink('https://www.nascar.com')">
        <div class="ncard-thumb">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Bristol_Motor_Speedway%2C_August_2017.jpg" alt="">
          <div class="ncard-ribbon"><span class="badge b-nascar">NASCAR · CUP</span></div>
        </div>
        <div class="ncard-body">
          <div class="ncard-type-row">
            <span class="tag-ext"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg> NASCAR.com</span>
          </div>
          <div class="ncard-title">Kyle Larson Vence em Talladega e Assume a Liderança da Cup Series 2026</div>
          <div class="ncard-excerpt">Prova marcada por chuva e bandeiras amarelas teve final emocionante com ultrapassagem na última volta do oval mais famoso do mundo.</div>
          <div class="ncard-footer">
            <span class="ncard-meta">8 ABR · NASCAR.COM</span>
            <span style="font-family:var(--fm);font-size:9px;color:var(--blue)">↗ sai do site</span>
          </div>
        </div>
        <div class="ncard-dest ext"><i class="fi fi-rr-link"></i> Abre NASCAR.com em nova aba</div>
      </div>"""

c6_new = """      <!-- CARD EXTERNO WRC -->
      <div class="ncard is-ext" data-cat="wrc" data-type="ext" onclick="extLink('https://www.wrc.com')">
        <div class="ncard-thumb">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/2019_Rally_Italia_Sardegna_-_Neuville.jpg" alt="">
          <div class="ncard-ribbon"><span class="badge b-wrc">WRC · RALLY</span></div>
        </div>
        <div class="ncard-body">
          <div class="ncard-type-row">
            <span class="tag-ext"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg> WRC.com</span>
          </div>
          <div class="ncard-title">Neuville Amplia Vantagem no WRC Após Rally de Portugal</div>
          <div class="ncard-excerpt">Belga da Hyundai domina a prova de ponta a ponta e abre 28 pontos de vantagem na classificação de pilotos do Mundial de Rally.</div>
          <div class="ncard-footer">
            <span class="ncard-meta">7 ABR · WRC.COM</span>
            <span style="font-family:var(--fm);font-size:9px;color:var(--blue)">↗ sai do site</span>
          </div>
        </div>
        <div class="ncard-dest ext"><i class="fi fi-rr-link"></i> Abre WRC.com em nova aba</div>
      </div>"""

new_grid_inner = f"\n{c1_match.group(1)}\n\n{c2_match.group(1)}\n\n{c3_new}\n\n{c4_new}\n\n{c5_new}\n\n{c6_new}\n\n{c7_match.group(1)}\n    "

# Replace the content of <div class="card-grid" id="cardGrid">... up to the closing section tag.
html = re.sub(r'(<div class="card-grid" id="cardGrid">)[\s\S]*?(</div>\n    </div>\n  </div>\n\n  <!-- PLANS SECTION -->)', r'\1' + new_grid_inner + r'\2', html)


# ==========================================
# REPLACEMENT 2: HERO SECTION
# ==========================================
html = html.replace('<h1 class="lp-title">Você já investe para correr.<br><span class="hl">Agora invista para ser encontrado.</span></h1>',
                    '<div class="lp-badge-line"><span class="lp-badge pulse">● AO VIVO</span><span class="lp-badge-text">+18.400 leitores acompanham o automobilismo pelo PitLane</span></div>\n      <h1 class="lp-title">Você já investe para correr.<br><span class="hl">Agora invista para ser encontrado.</span></h1>')

html = html.replace('Transforme seus resultados no asfalto em visibilidade profissional no Google. O portal que atrai patrocinadores enquanto você foca na pilotagem.',
                    'Matérias profissionais com seu nome no Google. Página exclusiva com suas conquistas. Patrocinadores encontram você — não o contrário.')

btn_hero_end = """        <button class="btn btn-out" style="font-size:18px;padding:15px 30px" onclick="toast('Fale conosco via WhatsApp para dúvidas','info')"><i class="fi fi-rr-comment"></i> Falar com Especialista</button>
      </div>"""

trust_bar = """        <button class="btn btn-out" style="font-size:18px;padding:15px 30px" onclick="toast('Fale conosco via WhatsApp para dúvidas','info')"><i class="fi fi-rr-comment"></i> Falar com Especialista</button>
      </div>
      <div class="lp-trust-bar">
        <span class="lp-trust-label">Suas matérias aparecem ao lado de notícias de</span>
        <div class="lp-trust-logos">
          <span>ESPN</span><span>SKY SPORTS</span><span>MOTORSPORT.COM</span><span>GPFANS</span><span>AUTOSPORT</span>
        </div>
      </div>"""
html = html.replace(btn_hero_end, trust_bar)

# ==========================================
# REPLACEMENT 3: PAIN SECTION
# ==========================================
pain_box_old = """      <div class="lp-pain-box">
        <p>A dura realidade do paddock: Correr custa caro e os patrocínios estão cada vez mais difíceis.</p>
        <p>Você envia um PDF genérico no WhatsApp e a empresa pesquisa seu nome no Google. <strong>O que eles encontram?</strong> Nada profissional. Apenas seu Instagram pessoal que o algoritmo não entrega e resultados perdidos de cronometragem de kart.</p>
        <p>Você passa 100% do tempo focado no setup do carro e 0% focado no seu marketing esportivo profissional.</p>
      </div>"""

pain_box_new = """      <h2 class="lp-title center">A dura realidade do paddock</h2>
      <p class="lp-subtitle center">Correr custa caro. Mas o problema real é outro.</p>
      <div class="lp-grid-3 lp-pain-cards">
        <div class="lp-pain-card">
          <div class="lp-pain-icon"><i class="fi fi-rr-envelope" style="font-size:32px;color:var(--acc)"></i></div>
          <h3>50 mensagens, 0 respostas</h3>
          <p>Você manda proposta pra dezenas de empresas. Nenhuma responde porque pesquisam seu nome no Google e não encontram nada profissional.</p>
        </div>
        <div class="lp-pain-card">
          <div class="lp-pain-icon"><i class="fi fi-rr-smartphone" style="font-size:32px;color:var(--acc)"></i></div>
          <h3>Instagram não fecha patrocínio</h3>
          <p>Diretor de marketing não analisa stories. Ele quer dados, mídia kit, resultados organizados e presença que transmita profissionalismo.</p>
        </div>
        <div class="lp-pain-card">
          <div class="lp-pain-icon"><i class="fi fi-rr-money-bill-wave" style="font-size:32px;color:var(--acc)"></i></div>
          <h3>R$5.000 na corrida, R$0 em visibilidade</h3>
          <p>Você investe tudo no carro e zero em marketing. O patrocinador que poderia pagar sua temporada nem sabe que você existe.</p>
        </div>
      </div>"""
html = html.replace(pain_box_old, pain_box_new)


# ==========================================
# REPLACEMENT 4: SOLUÇÃO
# ==========================================
html = html.replace('Tudo o que falta no seu <span class="hl">business</span>', 'Tudo o que falta na sua <span class="hl">carreira</span>')

# Replace exact lp-grid-3 for the solution section
# The solution section has:
#    <div class="lp-grid-3">
#      <div class="lp-card">
#        <i class="fi fi-rr-bullhorn"></i>
# Find the specific lp-grid-3 inside section 3:
sol_old = """    <div class="lp-grid-3">
      <div class="lp-card">
        <i class="fi fi-rr-bullhorn"></i>
        <h3>Mídia Espontânea</h3>"""

sol_new = """    <div class="lp-grid-3 lp-grid-4">
      <div class="lp-card">
        <i class="fi fi-rr-bullhorn"></i>
        <h3>Mídia Espontânea</h3>"""
html = html.replace(sol_old, sol_new)

sol_end_old = """      <div class="lp-card">
        <i class="fi fi-rr-badge-check"></i>
        <h3>Autoridade de Mídia</h3>
        <p>Compartilhe suas matérias nos seus perfis e propostas. O selo PitLane eleva sua credibilidade com qualquer diretor de marketing.</p>
      </div>
    </div>"""

sol_end_new = """      <div class="lp-card">
        <i class="fi fi-rr-badge-check"></i>
        <h3>Autoridade de Mídia</h3>
        <p>Compartilhe suas matérias nos seus perfis e propostas. O selo PitLane eleva sua credibilidade com qualquer diretor de marketing.</p>
      </div>
      <div class="lp-card">
        <i class="fi fi-rr-chart-histogram"></i>
        <h3>Painel de Controle</h3>
        <p>Acompanhe quantas pessoas viram suas matérias, quantos patrocinadores entraram em contato e o status de cada publicação. Tudo num painel simples.</p>
      </div>
    </div>"""
html = html.replace(sol_end_old, sol_end_new)


# ==========================================
# REPLACEMENT 5: COMO FUNCIONA
# ==========================================
step3_old = """      <div class="lp-step">
        <div class="lp-step-num">3</div>
        <h3>Você brilha</h3>
        <p>Suas matérias vão para a Home do PitLane e ganham URLs próprias indexáveis no Google e compartilháveis.</p>
      </div>
    </div>"""

step3_new = """      <div class="lp-step">
        <div class="lp-step-num">3</div>
        <h3>Você brilha</h3>
        <p>Suas matérias vão para a Home do PitLane e ganham URLs próprias indexáveis no Google e compartilháveis.</p>
      </div>
      <div class="lp-step">
        <div class="lp-step-num">4</div>
        <h3>Patrocinadores chegam</h3>
        <p>Empresas encontram sua página pesquisando no Google, veem suas matérias e entram em contato direto pelo formulário de patrocínio.</p>
      </div>
    </div>"""
html = html.replace(step3_old, step3_new)

# ==========================================
# REPLACEMENT 6: PROVA SOCIAL
# ==========================================
stats_old = """      <div class="lp-stats">
        <div class="lp-stat"><div class="lp-stat-num">+18.000</div><div class="lp-stat-lbl">Leitores por Mês</div></div>
        <div class="lp-stat"><div class="lp-stat-num">+140</div><div class="lp-stat-lbl">Matérias Publicadas</div></div>
        <div class="lp-stat"><div class="lp-stat-num">40+</div><div class="lp-stat-lbl">Pilotos no Grid</div></div>
      </div>"""

stats_new = """      <div class="lp-stats">
        <div class="lp-stat"><div class="lp-stat-num" data-target="18400" data-prefix="+">0</div><div class="lp-stat-lbl">Leitores por Mês</div></div>
        <div class="lp-stat"><div class="lp-stat-num" data-target="148">0</div><div class="lp-stat-lbl">Matérias Publicadas</div></div>
        <div class="lp-stat"><div class="lp-stat-num" data-target="47">0</div><div class="lp-stat-lbl">Pilotos no Grid</div></div>
        <div class="lp-stat"><div class="lp-stat-num" data-target="3" data-suffix="/mês">0</div><div class="lp-stat-lbl">Contatos de Patrocínio por Piloto</div></div>
      </div>"""
html = html.replace(stats_old, stats_new)

case_body_old = """            <p style="color:var(--muted);margin-bottom:20px;font-size:15px;line-height:1.6">"Antes de publicar no PitLane eu enviava dezenas de e-mails para empresas e nunca passava da secretária. Uma semana depois de ter minha página e três matérias listadas no portal, um diretor pesquisou meu nome no Google e achou tudo lindo. Fechamos R$20.000 na cota do macacão!"</p>
            <div style="font-family:var(--fd);font-size:20px;color:#FFF;margin-bottom:4px">Rafael Moura</div>
            <div style="font-family:var(--fm);font-size:12px;color:var(--blue);letter-spacing:1px">PILOTO F4 BRASIL · MOURA RACING</div>"""

case_body_new = """            <div class="lp-case-mini-stats">
              <span><strong>3 meses</strong> no PitLane</span>
              <span><strong>3 propostas</strong> de patrocínio</span>
              <span><strong>2.800+</strong> acessos</span>
            </div>
            <div class="lp-quote">"Antes do PitLane eu mandava 50 e-mails pedindo patrocínio e ninguém respondia. Hoje as empresas me encontram no Google e pedem pra conversar. Mudou completamente."</div>
            <div class="lp-author"><strong>Rafael Moura</strong> · Piloto F4 Brasil · 19 anos</div>"""
html = html.replace(case_body_old, case_body_new)


# ==========================================
# REPLACEMENT 7: BADGE GARANTIA
# ==========================================
guarantee = """          </ul>
          <button class="btn btn-acc btn-full" style="font-size:16px;padding:12px">Contratar Equipe</button>
        </div>
      </div>

      <div class="lp-guarantee">
        <i class="fi fi-rr-shield-check" style="font-size:28px;color:var(--success);flex-shrink:0"></i>
        <div>
          <strong style="font-family:var(--fd);font-size:18px;color:#FFF;display:block;margin-bottom:4px">Risco Zero</strong>
          <p style="color:var(--muted);font-size:14px;line-height:1.5;margin:0">Sem contrato. Sem taxa de adesão. Sem multa. Cancele pelo painel quando quiser — sem precisar ligar pra ninguém.</p>
        </div>
      </div>
    </div>
  </section>"""
html = html.replace('          <button class="btn btn-acc btn-full" style="font-size:16px;padding:12px">Contratar Equipe</button>\n        </div>\n      </div>\n    </div>\n  </section>', guarantee)


# ==========================================
# REPLACEMENT 8: COMPARATIVO
# ==========================================
html = html.replace('primeira págia no Google', 'primeira página do Google')
html = html.replace('orgânicamente', 'organicamente')
html = html.replace('Quanto mais matérias, mais forte seu Pagerank.', 'Quanto mais matérias, mais forte sua presença digital.')
html = html.replace('presença midiática necessária para sustentar a carreira a longo-prazo.', 'presença profissional que sustenta sua carreira a longo prazo.')


# ==========================================
# REPLACEMENT 9: FAQ
# ==========================================
html = html.replace('Dê jeito nenhum', 'De jeito nenhum')

faq_append = """      </details>
      <details>
        <summary>Em quanto tempo minha matéria aparece no Google?</summary>
        <div class="faq-body">Normalmente entre 3 a 7 dias após a publicação. O Google precisa indexar a página. Com o tempo, quanto mais matérias você tiver, mais rápido novas publicações aparecem nas buscas.</div>
      </details>
      <details>
        <summary>Preciso ter muitos seguidores pra funcionar?</summary>
        <div class="faq-body">Não. O PitLane funciona com busca orgânica no Google, não com seguidores. Empresas que procuram sobre automobilismo encontram suas matérias direto no buscador, independente de quantos seguidores você tem no Instagram.</div>
      </details>
      <details>
        <summary>Posso usar as matérias no meu mídia kit pessoal?</summary>
        <div class="faq-body">Sim. As matérias são sobre você e ficam públicas. Pode compartilhar o link com qualquer empresa ou incluir nos seus materiais de apresentação.</div>
      </details>
      <details>
        <summary>Vocês copiam notícias de outros sites?</summary>
        <div class="faq-body">Não. Notícias de fontes como ESPN e Sky Sports aparecem no portal com link direto pro site original. Apenas matérias de pilotos e equipes clientes são escritas pela nossa redação.</div>
      </details>
    </div>
  </section>"""
html = html.replace('      </details>\n    </div>\n  </section>', faq_append)


# ==========================================
# REPLACEMENT 10: CTA FINAL
# ==========================================
html = html.replace('O que eles lerão sobre você?', 'O que eles vão encontrar sobre você?')

# Find btn btn-acc mapping to final section
# We'll just replace the button block
cta_old = """      <div class="lp-btns" style="justify-content:center;margin-top:30px">
        <button class="btn btn-acc" style="font-size:18px;padding:16px 40px" onclick="document.getElementById('lp-pricing').scrollIntoView({behavior:'smooth'})">Selecionar Meu Plano</button>
      </div>
      <p style="margin-top:16px;font-family:var(--fm);font-size:12px;color:var(--muted)">Sem contratos amarrados. Publicação de imediato.</p>"""

cta_new = """      <div class="lp-btns" style="justify-content:center;margin-top:30px">
        <button class="btn btn-acc glow-acc" style="font-size:18px;padding:16px 40px" onclick="document.getElementById('lp-pricing').scrollIntoView({behavior:'smooth'})">Selecionar Meu Plano</button>
        <button class="btn btn-out" style="font-size:18px;padding:16px 32px" onclick="window.open('https://wa.me/5511999999999?text=Quero%20saber%20mais%20sobre%20os%20planos%20PitLane','_blank')"><i class="fi fi-rr-comment"></i> Falar no WhatsApp</button>
      </div>
      <p style="margin-top:16px;font-family:var(--fm);font-size:13px;color:var(--muted)">Sem contratos. Sem taxa. Primeira matéria publicada em até 48h.</p>"""
html = html.replace(cta_old, cta_new)


# ==========================================
# REPLACEMENT 11: WHATSAPP FLUTUANTE
# ==========================================
wa_floating = """<a href="https://wa.me/5511999999999?text=Quero%20saber%20sobre%20os%20planos%20PitLane" class="whatsapp-float" target="_blank" title="Fale conosco no WhatsApp">
  <svg viewBox="0 0 32 32" width="28" height="28" fill="#FFF"><path d="M16 3C8.832 3 3 8.832 3 16c0 2.295.6 4.553 1.738 6.535L3 29l6.617-1.738A12.94 12.94 0 0016 29c7.168 0 13-5.832 13-13S23.168 3 16 3zm0 23.75c-2.078 0-4.117-.586-5.879-1.691l-.422-.25-4.37 1.148 1.168-4.27-.273-.434A10.72 10.72 0 014.75 16C4.75 9.797 9.797 4.75 16 4.75S27.25 9.797 27.25 16 22.203 26.75 16 26.75zm5.871-8.016c-.32-.16-1.899-.938-2.191-1.046-.293-.11-.508-.16-.723.16-.215.32-.832 1.046-.02 1.262-.187.215-.375.242-.695.082-.32-.16-1.352-.5-2.574-1.59-.953-.848-1.594-1.898-1.781-2.219-.188-.32-.02-.492.14-.652.145-.145.321-.375.48-.562.161-.188.215-.32.321-.535.11-.215.055-.402-.027-.562-.082-.16-.723-1.742-.992-2.387-.258-.621-.52-.535-.723-.543h-.617c-.215 0-.562.082-.856.402s-1.125 1.098-1.125 2.68c0 1.582 1.152 3.11 1.313 3.324.16.215 2.265 3.457 5.488 4.848.77.332 1.367.531 1.836.68.77.246 1.469.21 2.023.128.617-.093 1.899-.777 2.168-1.527.266-.75.266-1.395.187-1.527-.082-.133-.297-.215-.621-.375z"/></svg>
</a>
</body>"""
html = html.replace('</body>', wa_floating)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")
