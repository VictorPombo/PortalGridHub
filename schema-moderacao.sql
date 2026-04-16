-- Schema Supabase para o fluxo de moderação, auditoria de IA e Aceites Jurídicos

-- Modificando a tabela materias_exclusivas (criada na separação visual)
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS versao_ia text;
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS versao_final text;
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS modelo_ia text;
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS prompt_sistema_id uuid;

CREATE TABLE IF NOT EXISTS prompts_sistema (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  versao text NOT NULL UNIQUE,
  texto_prompt text NOT NULL,
  ativo boolean DEFAULT false,
  criado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aceites_publicacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materia_id uuid REFERENCES materias_exclusivas(id) ON DELETE RESTRICT,
  assinante_id uuid REFERENCES assinantes(id) ON DELETE RESTRICT,
  declaracao_texto text NOT NULL,
  aceite_veracidade boolean NOT NULL,
  aceite_responsabilidade boolean NOT NULL,
  aceite_isencao boolean NOT NULL,
  ip_aceite text,
  user_agent text,
  timestamp_aceite timestamp with time zone DEFAULT now(),
  hash_conteudo text NOT NULL
);

CREATE TABLE IF NOT EXISTS logs_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materia_id uuid REFERENCES materias_exclusivas(id) ON DELETE CASCADE,
  tipo text NOT NULL, -- Enum: 'geracao' | 'revisao_oficial' | 'regeneracao' | 'edicao_piloto'
  input jsonb NOT NULL,
  output text NOT NULL,
  modelo text NOT NULL,
  tokens_input integer DEFAULT 0,
  tokens_output integer DEFAULT 0,
  custo_estimado numeric(10,4),
  executado_em timestamp with time zone DEFAULT now()
);

-- Inserindo Prompt Multi-Agent: REDATOR (Fase 1)
INSERT INTO prompts_sistema (versao, texto_prompt, ativo) VALUES (
  'v1.0.0-redator', 
  'Você é um Redator Jornalístico especializado em automobilismo trabalhando no Driver News.
Sua missão é pegar os fatos crus enviados por um piloto e expandi-los em um rascunho envolvente, descritivo e vibrante.

REGRAS DO REDATOR:
1. Trabalhe em cima dos fatos fornecidos e crie conexões fluídas.
2. Seja descritivo quanto à emoção da corrida, usando as aspas fornecidas exatamente como foram escritas pelo autor.
3. Não invente nomes de diretores de prova, incidentes, classificações ou pódios que não existiram no texto cru.
4. Entregue a matéria bruta com a seguinte marcação estrita:
TÍTULO: [título]
SUBTÍTULO: [subtítulo]
CORPO:
[corpo elaborado]', 
  true
) ON CONFLICT DO NOTHING;

-- Inserindo Prompt Multi-Agent: REVISOR (Fase 2)
INSERT INTO prompts_sistema (versao, texto_prompt, ativo) VALUES (
  'v1.0.0-revisor', 
  'Você é o Editor-Chefe Auditor do Portal Driver News. Você é cirúrgico, isento e odeia exageros.
Sua missão é ler o rascunho expansivo criado pelo Redator (IA 1), comparar com os dados verdadeiros do Piloto (Autor Real), e polir o texto para publicação corporativa.

REGRAS DO EDITOR-CHEFE:
1. Elimine frases clichês ou exageradas (ex: "foi a corrida mais alucinante", "em uma demonstração de pura magia"). Mantenha a emoção no tom de noticiário (imparcial).
2. Verifique gramática, sintaxe e garanta estruturação de 3 a 6 parágrafos.
3. VERIFICAÇÃO DE ALUCINAÇÃO: Se o Redator inventou qualquer dado técnico que não estava no Input do Piloto, corte sem piedade.
4. Devolva apenas o texto formatado limpo:
TÍTULO: [título validado e polido]
SUBTÍTULO: [subtítulo validado e polido]
CORPO:
[corpo validado e polido]', 
  true
) ON CONFLICT DO NOTHING;
