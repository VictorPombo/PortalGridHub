# TEXTOS DE ACEITE — DRIVER NEWS
## 2 momentos: Assinatura + Publicação de matéria

---

## ═══════════════════════════════════════════
## ACEITE 1 — NO MOMENTO DA ASSINATURA
## (checkbox obrigatório antes de finalizar pagamento)
## ═══════════════════════════════════════════

### Texto do checkbox:

---

☐ **Li e aceito os Termos de Uso e a Política de Privacidade do Driver News.**

Ao assinar, declaro que:

**1.** Autorizo o Driver News a utilizar meu **nome, imagem, dados biográficos, fotos e conteúdo** que eu fornecer para fins de publicação de matérias, divulgação na plataforma, redes sociais e materiais promocionais do portal, por prazo indeterminado, conforme Art. 20 do Código Civil e Art. 46 da Lei 9.610/98.

**2.** Sou o **titular legítimo** de todo material que enviar (textos, fotos, vídeos, dados) ou possuo autorização expressa de terceiros envolvidos.

**3.** Reconheço que as matérias publicadas em meu nome serão redigidas com auxílio de **inteligência artificial** a partir das informações que eu fornecer, e que a **aprovação final é minha responsabilidade exclusiva**.

**4.** Compreendo que sou **integralmente responsável** pela veracidade das informações que fornecer e pelo conteúdo que aprovar para publicação, inclusive perante terceiros e autoridades.

**5.** Autorizo o Driver News a manter registros (logs) de todos os meus envios, aprovações e publicações pelo prazo de **5 anos**, para fins de comprovação legal.

[Ler Termos de Uso completos](termos.html) · [Ler Política de Privacidade](politica.html)

---

### Regra de implementação:
- Checkbox DESMARCADO por padrão (LGPD exige ação afirmativa)
- Botão de pagamento BLOQUEADO até marcar
- Registrar no banco: data, hora, IP, user_id, versão do termo aceito


---
---


## ═══════════════════════════════════════════
## ACEITE 2 — ANTES DE PUBLICAR CADA MATÉRIA
## (tela de aprovação final, após revisar o texto gerado pela IA)
## ═══════════════════════════════════════════

### Layout sugerido:

Acima da matéria finalizada, exibir um bloco de destaque (fundo vermelho escuro ou borda vermelha) com o texto abaixo. O botão "Publicar" só libera após marcar o checkbox.

---

### Texto do bloco:

⚠️ **DECLARAÇÃO OBRIGATÓRIA — LEIA COM ATENÇÃO**

Ao clicar em **"Publicar"**, eu declaro sob as penas da lei que:

**1. VERACIDADE** — Todas as informações contidas nesta matéria são **verdadeiras e de minha inteira responsabilidade**. Revisei o conteúdo gerado pela inteligência artificial e confirmo que os fatos, nomes, resultados, citações e dados apresentados correspondem à realidade.

**2. DIREITOS DE IMAGEM** — Possuo os **direitos ou autorização expressa** sobre todas as fotos e imagens enviadas. Caso as imagens retratem terceiros, declaro ter o consentimento dessas pessoas para publicação.

**3. DIREITOS AUTORAIS** — O conteúdo que forneci é **original ou devidamente autorizado**. Não há plágio, cópia ou reprodução de conteúdo protegido por direitos autorais de terceiros.

**4. RESPONSABILIDADE LEGAL** — Estou ciente de que:

   - A publicação de **informações falsas** pode configurar crime contra a honra (calúnia, difamação ou injúria) nos termos dos **Arts. 138 a 140 do Código Penal**, com penas de detenção de 1 mês a 2 anos e multa;

   - A divulgação de **fato inverídico** sobre pessoa, empresa ou instituição pode gerar **obrigação de indenizar** por danos morais e materiais, conforme **Arts. 186 e 927 do Código Civil**;

   - O uso indevido de imagem de terceiros sem autorização viola o **Art. 20 do Código Civil** e o **Art. 5º, inciso X da Constituição Federal**;

   - O Driver News **não é responsável** pelo conteúdo aprovado por mim, conforme **Art. 19 do Marco Civil da Internet (Lei 12.965/14)**, e poderá fornecer meus dados cadastrais e registros de publicação mediante ordem judicial.

**5. REGISTRO** — Esta aprovação será registrada com meu **nome, IP, data e hora**, e mantida por **5 anos** para fins de comprovação legal, podendo ser apresentada em juízo.

---

☐ **Declaro que li, compreendi e aceito integralmente os termos acima. Assumo total responsabilidade pelo conteúdo desta matéria.**

[ 🔴 PUBLICAR MATÉRIA ]

---

### Regras de implementação:
- Checkbox DESMARCADO por padrão
- Botão "Publicar" DESABILITADO (cinza) até marcar
- Ao marcar e clicar, registrar no banco:
  - user_id
  - materia_id
  - timestamp (UTC)
  - IP do usuário
  - versão do texto de aceite (ex: "consent_v1")
  - hash do conteúdo aprovado (para provar que não foi alterado depois)
- O texto de aceite NÃO deve ser editável pelo usuário
- Em caso de disputa, o Driver News apresenta: o aceite registrado + o conteúdo exato que foi aprovado


---
---


## ═══════════════════════════════════════════
## INFORMAÇÃO PARA O ANTIGRAVITY (implementação)
## ═══════════════════════════════════════════

### Tabela Supabase sugerida: publication_consents

```sql
CREATE TABLE IF NOT EXISTS publication_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  materia_id TEXT NOT NULL,
  consent_type TEXT NOT NULL, -- 'subscription' ou 'publication'
  consent_version TEXT NOT NULL DEFAULT 'v1',
  content_hash TEXT, -- SHA-256 do conteúdo aprovado (só para publication)
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_user ON publication_consents (user_id);
CREATE INDEX IF NOT EXISTS idx_consent_materia ON publication_consents (materia_id);
```

### Fluxo resumido:

**Assinatura:**
1. Usuário preenche dados → marca checkbox do Aceite 1 → clica "Assinar"
2. Sistema registra consent_type = 'subscription' com IP e timestamp
3. Pagamento é processado

**Publicação:**
1. Usuário preenche formulário com fotos e dados
2. IA gera matéria → usuário revisa
3. Tela de aprovação com Aceite 2 → marca checkbox → clica "Publicar"
4. Sistema calcula hash do conteúdo, registra consent_type = 'publication'
5. Matéria vai ao ar

**Em caso de problema jurídico:**
- Driver News apresenta: registro de aceite + conteúdo original + hash + IP + timestamp
- Responsabilidade recai 100% sobre o assinante
- Driver News age como plataforma (Art. 19 Marco Civil), não como editor
