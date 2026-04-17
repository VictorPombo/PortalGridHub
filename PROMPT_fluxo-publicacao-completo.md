# FLUXO COMPLETO DE PUBLICAÇÃO DE MATÉRIAS — DRIVER NEWS
## Antigravity — Cole tudo abaixo

---

Você vai implementar o fluxo completo de criação, revisão, edição e publicação de matérias de assinantes no Driver News. São 5 telas conectadas entre si, com integração ao Supabase e à IA (Gemini). Implemente TUDO na ordem abaixo.

---

# ══════════════════════════════════════════
# VISÃO GERAL DO FLUXO
# ══════════════════════════════════════════

```
FORMULÁRIO (já existe)
    │
    ▼ clica "Enviar para Redação"
TELA 1 — AGUARDANDO REDAÇÃO
    │  countdown 60s + loading
    │  IA gera a matéria em background
    ▼ matéria pronta
TELA 2 — PRÉ-VISUALIZAÇÃO
    │
    ├──► [APROVAR MATÉRIA] ──► TELA 5 — ACEITE LEGAL ──► PUBLICA
    │
    └──► [QUERO EDITAR ALGO]
              │
              ├──► [EU MESMO EDITO] ──► TELA 3 — EDITOR COMPLETO
              │         │                    │
              │         │  salva edição      │
              │         └────────────────────┘
              │                              ▼
              │                     volta pra TELA 2
              │
              └──► [EQUIPE CORRIGE] ──► TELA 4 — SOLICITAR CORREÇÃO
                        │  descreve correção
                        │  IA reescreve
                        ▼
                   volta pra TELA 2 (com versão corrigida)
```

---

# ══════════════════════════════════════════
# BANCO DE DADOS — SUPABASE
# ══════════════════════════════════════════

## Tabela: materias

Execute este SQL no Supabase (se a tabela já existir com campos diferentes, adicione os campos que faltam sem apagar os existentes):

```sql
-- Só crie se não existir. Se já existir, faça ALTER TABLE pra adicionar campos faltantes.
CREATE TABLE IF NOT EXISTS materias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'rascunho',
    -- Valores possíveis: 'rascunho' | 'gerando' | 'revisao' | 'editando' | 'corrigindo' | 'aprovada' | 'publicada'
  
  -- Conteúdo original (input do usuário)
  input_titulo TEXT,
  input_corpo TEXT,
  input_fotos TEXT[], -- array de URLs das fotos enviadas
  input_categoria TEXT,
  input_dados_extras JSONB, -- qualquer campo adicional do formulário
  
  -- Conteúdo gerado pela IA
  ia_titulo TEXT,
  ia_corpo TEXT,
  ia_versao INT DEFAULT 1, -- incrementa a cada correção da IA
  
  -- Conteúdo final (pode ser editado pelo usuário)
  final_titulo TEXT,
  final_corpo TEXT,
  final_fotos TEXT[],
  final_fotos_ordem INT[], -- ordem das fotos definida pelo usuário
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Logs de correção
  historico_correcoes JSONB DEFAULT '[]'::jsonb
    -- Array de objetos: [{pedido: "...", resultado: "...", timestamp: "...", versao: N}]
);

CREATE INDEX IF NOT EXISTS idx_materias_user ON materias (user_id);
CREATE INDEX IF NOT EXISTS idx_materias_status ON materias (status);
```

## Tabela: publication_consents (aceites legais)

```sql
CREATE TABLE IF NOT EXISTS publication_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  materia_id UUID NOT NULL REFERENCES materias(id),
  consent_type TEXT NOT NULL DEFAULT 'publication',
  consent_version TEXT NOT NULL DEFAULT 'v1',
  content_hash TEXT NOT NULL, -- SHA-256 do conteúdo final no momento da aprovação
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_user ON publication_consents (user_id);
CREATE INDEX IF NOT EXISTS idx_consent_materia ON publication_consents (materia_id);
```

---

# ══════════════════════════════════════════
# TELA 1 — AGUARDANDO REDAÇÃO
# ══════════════════════════════════════════

## Quando ativa:
Quando o usuário clica "Enviar para Redação" no formulário de criação de matéria.

## O que acontece no backend:
1. Salva o input do usuário na tabela `materias` com status = `'gerando'`
2. Chama a IA (Gemini) para gerar a matéria (título + corpo completo em formato jornalístico)
3. Quando a IA retorna, salva `ia_titulo` e `ia_corpo` na tabela
4. Copia os valores da IA para `final_titulo` e `final_corpo` (versão inicial)
5. Atualiza status para `'revisao'`

## O que o usuário vê:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          ✍️                                     │
│     (ícone animado de escrita/caneta)           │
│                                                 │
│   Aguarde enquanto nossa equipe                 │
│   redige sua matéria profissional               │
│                                                 │
│          ⏱ 00:47                                │
│     (countdown de 60 segundos)                  │
│                                                 │
│   ░░░░░░░░░░████████░░░░░░░░░░                  │
│   (barra de progresso animada)                  │
│                                                 │
│   Estamos transformando suas informações        │
│   em uma matéria jornalística de alto nível.    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Comportamento:
- Countdown começa em 60 segundos e conta regressivamente
- Barra de progresso avança proporcionalmente
- A cada 3 segundos, faz polling no backend para verificar se o status mudou para `'revisao'`
- Quando o status muda OU o countdown chega a zero (o que vier primeiro):
  - Se a matéria está pronta → redireciona para TELA 2
  - Se a IA ainda não retornou → mostra "Quase lá... finalizando os últimos detalhes" e continua o polling sem countdown (máximo mais 30 segundos)
  - Se der erro → mostra mensagem "Houve um problema. Tente novamente." com botão de retry

### Visual:
- Fundo escuro (mesma identidade visual do site: #0e0e18)
- Ícone animado centralizado (pode ser SVG de caneta escrevendo ou engrenagem girando)
- Countdown em fonte grande, cor accent (#e8002d)
- Texto em cor clara (#a0a0b8)
- Sem header/menu — tela limpa e focada

---

# ══════════════════════════════════════════
# TELA 2 — PRÉ-VISUALIZAÇÃO DA MATÉRIA
# ══════════════════════════════════════════

## Quando ativa:
Quando a matéria está com status `'revisao'` e o usuário é redirecionado da Tela 1.

## O que o usuário vê:

A matéria renderizada EXATAMENTE como ficará publicada no portal — mesmo layout, mesmas fontes, mesmas cores. O objetivo é que o piloto veja a versão final real.

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  👁 PRÉ-VISUALIZAÇÃO DA SUA MATÉRIA             │
│  ─────────────────────────────────              │
│                                                 │
│  [IMAGEM PRINCIPAL]                             │
│                                                 │
│  STOCK CAR · 17 ABR 2026                        │
│                                                 │
│  Título da Matéria Gerada pela IA               │
│                                                 │
│  Corpo da matéria completo renderizado           │
│  como ficará no portal...                       │
│  Lorem ipsum etc.                               │
│                                                 │
│  [FOTO 2]  [FOTO 3]                            │
│                                                 │
│  Continuação do texto...                        │
│                                                 │
│  ─────────────────────────────────              │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │  ✏️ QUERO EDITAR  │  │  ✅ APROVAR      │     │
│  │     ALGO         │  │    MATÉRIA       │     │
│  └──────────────────┘  └──────────────────┘     │
│                                                 │
│  (botão cinza)          (botão vermelho)         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Dois botões principais:

**✅ APROVAR MATÉRIA** (botão vermelho, destaque)
→ Vai para TELA 5 (aceite legal + publicação)

**✏️ QUERO EDITAR ALGO** (botão cinza/outline)
→ Abre modal ou seção com 2 sub-opções:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Como você quer editar?                         │
│                                                 │
│  ┌──────────────────────────────────────┐       │
│  │  ✍️ QUERO EU MESMO ATUALIZAR         │       │
│  │  Abrir editor completo para editar   │       │
│  │  texto, mover fotos e montar         │       │
│  │  a matéria do seu jeito.             │       │
│  └──────────────────────────────────────┘       │
│                                                 │
│  ┌──────────────────────────────────────┐       │
│  │  🤖 QUERO QUE A EQUIPE CORRIJA       │       │
│  │  Descreva o que deve ser corrigido   │       │
│  │  e nossa equipe reescreve pra você.  │       │
│  └──────────────────────────────────────┘       │
│                                                 │
│           [VOLTAR]                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

# ══════════════════════════════════════════
# TELA 3 — EDITOR COMPLETO (eu mesmo edito)
# ══════════════════════════════════════════

## Quando ativa:
Quando o usuário clica "Quero eu mesmo atualizar" na Tela 2.

## Atualizar status:
Status da matéria muda para `'editando'`

## O que o usuário vê:

Editor completo com:

### Título editável
- Input de texto com o título atual (`final_titulo`)
- Contador de caracteres (máx 120)

### Corpo editável
- Textarea grande OU editor rich text (se já existir componente no projeto)
- Conteúdo pré-preenchido com `final_corpo`
- Permite formatar parágrafos

### Galeria de fotos com drag & drop
- Thumbnails das fotos enviadas (`final_fotos`)
- O usuário pode ARRASTAR para reordenar
- Pode REMOVER foto (clique no X)
- Pode ADICIONAR nova foto (botão + upload)
- A ordem salva no campo `final_fotos_ordem`

### Botões:

```
┌──────────────────┐  ┌──────────────────┐
│  ← CANCELAR      │  │  💾 SALVAR E      │
│    EDIÇÃO        │  │    VISUALIZAR    │
└──────────────────┘  └──────────────────┘
```

**CANCELAR EDIÇÃO** → volta pra Tela 2 sem salvar (status volta pra 'revisao')

**SALVAR E VISUALIZAR** →
1. Salva `final_titulo`, `final_corpo`, `final_fotos`, `final_fotos_ordem` no banco
2. Atualiza status para `'revisao'`
3. Redireciona de volta para TELA 2 (agora mostrando a versão editada)

---

# ══════════════════════════════════════════
# TELA 4 — SOLICITAR CORREÇÃO (equipe corrige)
# ══════════════════════════════════════════

## Quando ativa:
Quando o usuário clica "Quero que a equipe corrija pra mim" na Tela 2.

## O que o usuário vê:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  🤖 SOLICITAR CORREÇÃO                          │
│  ─────────────────────────────────              │
│                                                 │
│  Descreva o que deve ser corrigido na matéria:  │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │                                         │    │
│  │  Ex: "Trocar o nome da equipe de        │    │
│  │  Full Time para Crown Racing. Adicionar │    │
│  │  que foi minha primeira vitória na      │    │
│  │  temporada. Tirar o último parágrafo."  │    │
│  │                                         │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │  ← VOLTAR        │  │  📤 ENVIAR        │     │
│  │                  │  │    CORREÇÃO      │     │
│  └──────────────────┘  └──────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Ao clicar "ENVIAR CORREÇÃO":

1. Atualiza status para `'corrigindo'`
2. Redireciona para TELA 1 de loading novamente (mesma tela de aguardando, com texto diferente):

```
Aplicando suas correções...
Nossa equipe está ajustando a matéria conforme seu pedido.
⏱ 00:45
```

3. No backend:
   - Chama a IA (Gemini) com o prompt:

```
Você é editor do Driver News. O assinante pediu a seguinte correção na matéria abaixo:

PEDIDO DO ASSINANTE:
"[texto que o usuário digitou]"

MATÉRIA ATUAL:
Título: [final_titulo]
Corpo: [final_corpo]

Aplique EXATAMENTE o que o assinante pediu. Não altere nada além do solicitado.
Mantenha o tom jornalístico profissional.
Retorne no formato:
{"titulo": "...", "corpo": "..."}
Sem markdown. Sem texto fora do JSON.
```

4. Quando a IA retorna:
   - Incrementa `ia_versao`
   - Salva nova versão em `final_titulo` e `final_corpo`
   - Adiciona ao `historico_correcoes`:
     ```json
     {
       "pedido": "texto do usuário",
       "versao_antes": 1,
       "versao_depois": 2,
       "timestamp": "2026-04-17T..."
     }
     ```
   - Atualiza status para `'revisao'`
   - Redireciona para TELA 2 (com a versão corrigida)

---

# ══════════════════════════════════════════
# TELA 5 — ACEITE LEGAL + PUBLICAÇÃO
# ══════════════════════════════════════════

## Quando ativa:
Quando o usuário clica "Aprovar Matéria" na Tela 2.

## O que o usuário vê:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ⚠️ DECLARAÇÃO OBRIGATÓRIA                      │
│  ─────────────────────────────────              │
│  (fundo vermelho escuro ou borda vermelha)      │
│                                                 │
│  Ao publicar, eu declaro sob as penas           │
│  da lei que:                                    │
│                                                 │
│  1. VERACIDADE — Todas as informações são       │
│     verdadeiras e de minha responsabilidade.    │
│     Revisei o conteúdo gerado pela IA e         │
│     confirmo que os fatos correspondem à        │
│     realidade.                                  │
│                                                 │
│  2. DIREITOS DE IMAGEM — Possuo direitos ou     │
│     autorização sobre todas as fotos.           │
│                                                 │
│  3. RESPONSABILIDADE LEGAL — Publicar           │
│     informações falsas pode configurar crime    │
│     contra a honra (Arts. 138-140 do Código     │
│     Penal, detenção de 1 mês a 2 anos).         │
│     O Driver News poderá fornecer meus dados    │
│     mediante ordem judicial.                    │
│                                                 │
│  4. REGISTRO — Esta aprovação é registrada      │
│     com meu IP, data e hora, mantida por        │
│     5 anos para fins legais.                    │
│                                                 │
│  ☐ Declaro que li, compreendi e aceito.         │
│    Assumo total responsabilidade.               │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │  ← VOLTAR        │  │  🔴 PUBLICAR      │     │
│  │                  │  │    MATÉRIA       │     │
│  └──────────────────┘  └──────────────────┘     │
│                                                 │
│  (botão PUBLICAR desabilitado até marcar)        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Ao marcar checkbox + clicar PUBLICAR:

1. Calcula hash SHA-256 do conteúdo final (`final_titulo` + `final_corpo`)
2. Registra na tabela `publication_consents`:
   - user_id
   - materia_id
   - consent_version: 'v1'
   - content_hash: o hash calculado
   - ip_address: IP do usuário
   - user_agent: navigator.userAgent
3. Atualiza status da matéria para `'publicada'`
4. Define `published_at` = NOW()
5. Redireciona para tela de sucesso:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          🎉                                     │
│                                                 │
│   Sua matéria foi publicada com sucesso!        │
│                                                 │
│   Ela já está disponível no portal              │
│   Driver News.                                  │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │  📋 COPIAR LINK   │  │  👁 VER MATÉRIA   │     │
│  └──────────────────┘  └──────────────────┘     │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  📤 COMPARTILHAR                        │    │
│  │  WhatsApp · X · Copiar Link             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

# ══════════════════════════════════════════
# REGRAS GERAIS DE IMPLEMENTAÇÃO
# ══════════════════════════════════════════

## Visual:
- Mesma identidade visual do Driver News em TODAS as telas
- Fundo escuro (#0e0e18)
- Accent: vermelho (#e8002d)
- Textos: branco (#fff) para títulos, cinza claro (#a0a0b8) para corpo
- Fonte: mesma do site (DM Sans / Inter)
- Responsivo — funcionar em mobile

## Navegação:
- Todas as telas devem ter botão de VOLTAR funcional
- O usuário pode sair e voltar depois — o status da matéria está salvo no banco
- Se o usuário voltar ao dashboard com matéria em status 'revisao', deve ter botão para "Continuar revisão" que leva direto pra TELA 2

## Segurança:
- Verificar que o user_id logado é o dono da matéria em TODAS as telas
- Não permitir que um usuário veja/edite matéria de outro
- O checkbox de aceite NUNCA vem marcado por padrão
- O botão PUBLICAR só ativa após marcar o checkbox

## IA (Gemini):
- Usar o mesmo modelo já configurado no projeto (gemini-1.5-flash)
- Se a IA falhar, mostrar mensagem de erro e botão "Tentar novamente"
- Nunca publicar matéria sem que o usuário tenha visualizado e aprovado

## Banco (Supabase):
- Atualizar `updated_at` em toda alteração
- O campo `historico_correcoes` é append-only (nunca apagar correções anteriores)
- O campo `content_hash` no aceite serve como prova de que o conteúdo aprovado não foi alterado depois

---

# ══════════════════════════════════════════
# O QUE NÃO ALTERAR
# ══════════════════════════════════════════

- NÃO altere o route.ts de notícias
- NÃO altere homepage.js ou homepage.css
- NÃO altere as páginas de política/termos/remoção
- NÃO altere o sistema de login/cadastro existente
- Apenas ADICIONE as novas telas e a lógica de publicação

---

# ══════════════════════════════════════════
# TESTE
# ══════════════════════════════════════════

1. Preencher formulário de matéria → clicar "Enviar para Redação"
2. Tela de loading deve aparecer com countdown de 60s
3. Após IA gerar → pré-visualização deve mostrar a matéria formatada
4. Clicar "Quero Editar" → "Eu mesmo edito" → editor deve abrir com conteúdo pré-preenchido
5. Editar título → salvar → voltar pra pré-visualização com título atualizado
6. Clicar "Quero Editar" → "Equipe corrige" → descrever correção → loading → voltar com matéria corrigida
7. Clicar "Aprovar" → tela de aceite legal → checkbox desmarcado → botão desabilitado
8. Marcar checkbox → botão ativa → clicar Publicar → tela de sucesso
9. Verificar no Supabase: matéria com status 'publicada' + registro em publication_consents com hash
